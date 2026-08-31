/**
 * ISOLATED SERVER-SIDE WEB PUSH DISPATCHER MODULE
 * Used by Scheduled Cron Jobs or Admin Custom Notification Workers.
 * Handles payload signing, atomic duplicate logging, and dead subscription cleanup.
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
      `[PUSH SKIPPED] VAPID keys or web-push library unconfigured for ${notificationType}:${entityId}.`
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
      .select("id, endpoint, p256dh, auth, failure_count")
      .eq("is_active", true);

    if (fetchError) {
      console.error("Error fetching active push subscriptions:", fetchError);
      return { success: false, error: fetchError };
    }

    const totalCount = subscriptions ? subscriptions.length : 0;
    if (!subscriptions || totalCount === 0) {
      console.log("No active push subscriptions to notify.");
      return { success: true, totalCount: 0, sentCount: 0, skippedCount: 0, deactivatedCount: 0, failedCount: 0 };
    }

    console.log(
      `[PUSH DISPATCH] Dispatching ${notificationType}:${entityId} to ${totalCount} active subscription/s...`
    );

    let sentCount = 0;
    let skippedCount = 0;
    let deactivatedCount = 0;
    let failedCount = 0;

    const stringEntityId = String(entityId);

    for (const sub of subscriptions) {
      // 1. ATOMIC DISPATCH CLAIM BEFORE NETWORK DELIVERY
      // Uses database RPC to insert into notification_dispatch_logs.
      // If another worker process already claimed this pair, RPC returns false -> skip dispatching.
      let claimed = false;
      const { data: rpcClaimed, error: claimError } = await supabase.rpc(
        "claim_notification_dispatch",
        {
          p_notification_type: notificationType,
          p_entity_id: stringEntityId,
          p_subscription_id: sub.id,
        }
      );

      if (claimError) {
        // Fallback: If RPC call fails, attempt direct insert with duplicate key handling
        const { error: directInsertErr } = await supabase
          .from("notification_dispatch_logs")
          .insert({
            notification_type: notificationType,
            entity_id: stringEntityId,
            subscription_id: sub.id,
          });

        if (directInsertErr) {
          // Code 23505 indicates unique constraint violation (already claimed)
          if (directInsertErr.code === "23505") {
            skippedCount++;
            continue;
          }
          console.error(`Claim error for sub ${sub.id}:`, directInsertErr);
          failedCount++;
          continue;
        }
        claimed = true;
      } else {
        claimed = !!rpcClaimed;
      }

      if (!claimed) {
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

        // 2. Update subscription success metadata
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

        // 3. Dead Subscription Cleanup on 404 or 410
        if (statusCode === 404 || statusCode === 410) {
          deactivatedCount++;
          await supabase
            .from("push_subscriptions")
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq("id", sub.id);
        } else {
          // Increment failure count for transient errors
          failedCount++;
          await supabase
            .from("push_subscriptions")
            .update({ failure_count: (sub.failure_count || 0) + 1 })
            .eq("id", sub.id);
        }
      }
    }

    console.log(
      `[PUSH DISPATCH COMPLETE] Total: ${totalCount}, Sent: ${sentCount}, Skipped: ${skippedCount}, Deactivated: ${deactivatedCount}, Failed: ${failedCount}`
    );

    return {
      success: true,
      totalCount,
      sentCount,
      skippedCount,
      deactivatedCount,
      failedCount,
    };
  } catch (err) {
    console.error("Unhandled error in dispatchWebPushNotification:", err);
    return { success: false, error: err };
  }
}
