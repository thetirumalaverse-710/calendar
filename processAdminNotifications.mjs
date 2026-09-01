import { createClient } from "@supabase/supabase-js";
import { dispatchWebPushNotification } from "./pushDispatcher.mjs";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Missing Supabase server environment variables (VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function processPendingAdminNotifications() {
  console.log(
    `\n[${new Date().toISOString()}] Checking pending custom admin notifications...`
  );

  try {
    const { data: pendingNotifs, error: fetchErr } = await supabase
      .from("admin_custom_notifications")
      .select("id, title, body, url")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchErr) {
      console.error(
        "[ADMIN PUSH ERROR] Failed to fetch pending notifications:",
        fetchErr.message || fetchErr
      );
      return;
    }

    if (!pendingNotifs || pendingNotifs.length === 0) {
      console.log("[ADMIN PUSH] No pending custom admin notifications found.");
      return;
    }

    console.log(
      `[ADMIN PUSH] Found ${pendingNotifs.length} pending custom notification(s). Processing...`
    );

    for (const notif of pendingNotifs) {
      // 1. Atomically claim notification row to prevent duplicate worker processing
      const { data: claimed, error: claimErr } = await supabase.rpc(
        "claim_admin_notification",
        { p_notification_id: notif.id }
      );

      if (claimErr) {
        console.error(
          `[ADMIN PUSH ERROR] Claim failed for notification ${notif.id}:`,
          claimErr.message || claimErr
        );
        continue;
      }

      if (!claimed) {
        console.log(
          `[ADMIN PUSH] Notification ${notif.id} already claimed by another process. Skipping.`
        );
        continue;
      }

      console.log(
        `[ADMIN PUSH DISPATCH START] Claimed notification ${notif.id}: "${notif.title}"`
      );

      // 2. Execute Web Push dispatch via generic dispatcher
      const result = await dispatchWebPushNotification({
        supabase,
        notificationType: "admin_custom",
        entityId: notif.id,
        payload: {
          title: notif.title,
          body: notif.body,
          url: notif.url || "https://thetirumalaverse.in/",
          icon: "/logo-64.png",
          type: "admin_custom",
        },
      });

      // 3. Update notification record status & execution stats
      const finalStatus = result.success ? "completed" : "failed";
      await supabase
        .from("admin_custom_notifications")
        .update({
          status: finalStatus,
          recipient_count: result.totalCount || 0,
          success_count: result.sentCount || 0,
          failure_count: result.failedCount || 0,
          deactivated_count: result.deactivatedCount || 0,
        })
        .eq("id", notif.id);

      console.log(
        `[ADMIN PUSH DISPATCH COMPLETE] Notification ${notif.id} marked ${finalStatus}. Sent: ${
          result.sentCount || 0
        }, Deactivated: ${result.deactivatedCount || 0}`
      );
    }
  } catch (err) {
    console.error("[ADMIN PUSH UNHANDLED ERROR]:", err.message || err);
  }
}

// Standalone execution entry point
processPendingAdminNotifications()
  .then(() => {
    console.log("[ADMIN PUSH] Outbox processor execution finished.");
  })
  .catch((err) => {
    console.error("[ADMIN PUSH FATAL ERROR]:", err);
    process.exit(1);
  });
