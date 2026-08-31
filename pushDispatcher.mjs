/**
 * ISOLATED SERVER-SIDE WEB PUSH DISPATCHER MODULE
 * Used by Telegram Worker or Scheduled Cron Jobs.
 * Handles payload signing, duplicate logging, and dead subscription cleanup.
 */

const VAPID_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY?.trim();
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY?.trim();
const VAPID_SUBJECT = process.env.VAPID_SUBJECT?.trim() || "mailto:admin@thetirumalaverse.in";

let webpush = null;
let isVapidConfigured = false;

async function initWebPush() {
  if (isVapidConfigured) return true;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return false;
  }

  try {
    const importedModule = await import("web-push");
    webpush = importedModule.default || importedModule;

    webpush.setVapidDetails(
      VAPID_SUBJECT,
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
    isVapidConfigured = true;
    return true;
  } catch (err) {
    console.warn("[PUSH MODULE WARNING] web-push library or VAPID keys unconfigured:", err.message);
    return false;
  }
}

export async function dispatchWebPushNotification({
  supabase,
  notificationType,
  entityId,
  payload,
}) {
  const ready = await initWebPush();
  if (!ready || !webpush) {
    console.warn(
      `[PUSH SKIPPED] VAPID keys or web-push library not configured for notification ${notificationType}:${entityId}.`
    );
    return { success: false, reason: "vapid_unconfigured" };
  }

  if (!supabase || !notificationType || !entityId || !payload) {
    console.error("Invalid dispatch parameters for dispatchWebPushNotification.");
    return { success: false, reason: "invalid_params" };
  }

  try {
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("is_active", true);

    if (fetchError) {
      console.error("Error fetching active push subscriptions:", fetchError);
      return { success: false, error: fetchError };
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No active push subscriptions to notify.");
      return { success: true, count: 0 };
    }

    console.log(
      `[PUSH DISPATCH] Dispatching ${notificationType}:${entityId} to ${subscriptions.length} active subscription/s...`
    );

    let sentCount = 0;
    let skippedCount = 0;
    let deactivatedCount = 0;

    for (const sub of subscriptions) {
      // 1. Database-backed duplicate check
      const { data: existingLog } = await supabase
        .from("notification_dispatch_logs")
        .select("id")
        .eq("notification_type", notificationType)
        .eq("entity_id", entityId)
        .eq("subscription_id", sub.id)
        .maybeSingle();

      if (existingLog) {
        skippedCount++;
        continue;
      }

      const pushSubscriptionObj = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(
          pushSubscriptionObj,
          JSON.stringify(payload)
        );

        sentCount++;

        // 2. Log duplicate prevention record
        await supabase.from("notification_dispatch_logs").insert({
          notification_type: notificationType,
          entity_id: entityId,
          subscription_id: sub.id,
        });

        // 3. Update subscription success metadata
        await supabase
          .from("push_subscriptions")
          .update({
            last_success_at: new Date().toISOString(),
            failure_count: 0,
          })
          .eq("id", sub.id);
      } catch (pushErr) {
        const statusCode = pushErr.statusCode;
        console.error(
          `Push error for sub ${sub.id} (HTTP ${statusCode}):`,
          pushErr.message
        );

        // 4. Dead Subscription Cleanup on 404 or 410
        if (statusCode === 404 || statusCode === 410) {
          deactivatedCount++;
          await supabase
            .from("push_subscriptions")
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq("id", sub.id);
        } else {
          // Increment failure count for transient errors
          await supabase
            .from("push_subscriptions")
            .update({ failure_count: (sub.failure_count || 0) + 1 })
            .eq("id", sub.id);
        }
      }
    }

    console.log(
      `[PUSH DISPATCH COMPLETE] Sent: ${sentCount}, Skipped duplicates: ${skippedCount}, Deactivated endpoints: ${deactivatedCount}`
    );

    return { success: true, sentCount, skippedCount, deactivatedCount };
  } catch (err) {
    console.error("Unhandled error in dispatchWebPushNotification:", err);
    return { success: false, error: err };
  }
}
