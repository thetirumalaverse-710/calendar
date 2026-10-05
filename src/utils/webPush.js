import { toast } from "./toast";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();

export const ELIGIBLE_NOTIFICATION_TEMPLES = ["tirumala-main"];

export function validateNotificationTemples(templeIds) {
  if (!Array.isArray(templeIds)) return [...ELIGIBLE_NOTIFICATION_TEMPLES];
  const filtered = templeIds.filter((id) =>
    ELIGIBLE_NOTIFICATION_TEMPLES.includes(id)
  );
  return filtered.length > 0 ? filtered : [...ELIGIBLE_NOTIFICATION_TEMPLES];
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getExistingPushSubscription() {
  if (!(await isPushSupported())) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.warn("Could not check existing push subscription:", error);
    return null;
  }
}

export async function subscribeToWebPush(
  supabaseClient,
  selectedTemples = ELIGIBLE_NOTIFICATION_TEMPLES,
  lang = "en",
  silent = false
) {
  if (!(await isPushSupported())) {
    return null;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn("VITE_VAPID_PUBLIC_KEY is not configured.");
    return null;
  }

  const validTemples = validateNotificationTemples(selectedTemples);

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await navigator.serviceWorker.register("/sw.js");
    }
    await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    const subscriptionJson = subscription.toJSON();
    const endpoint = subscriptionJson.endpoint;
    const p256dh = subscriptionJson.keys?.p256dh;
    const auth = subscriptionJson.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      throw new Error("Invalid PushSubscription payload.");
    }

    const { error: rpcError } = await supabaseClient.rpc(
      "register_push_subscription",
      {
        p_endpoint: endpoint,
        p_p256dh: p256dh,
        p_auth: auth,
        p_user_agent: navigator.userAgent,
        p_subscribed_temples: validTemples,
      }
    );

    if (rpcError) {
      console.error("RPC register_push_subscription error:", rpcError);
      throw rpcError;
    }

    if (!silent) {
      const message = lang === "te"
        ? "నోటిఫికేషన్లు ప్రారంభించబడ్డాయి: మీరు శ్రీవారి ఆలయం నుండి ముఖ్యమైన ప్రకటనలు మరియు ఉత్సవ నోటిఫికేషన్లను అందుకుంటారు."
        : "Notifications enabled: You will receive important announcements and event notifications from the Srivari Temple.";
      toast.success(message, 8000);

      try {
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification("🌸 Tirumala Temple Notifications Enabled", {
            body: "You will receive important announcements and event notifications from the Srivari Temple.",
            icon: "/logo-64.png",
            badge: "/logo-64.png",
            data: { url: "https://thetirumalaverse.in/" },
            tag: "welcome-srivari-notification"
          });
        }
      } catch (notifErr) {
        console.warn("Could not display welcome notification:", notifErr);
      }
    }

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to Web Push:", error);
    return null;
  }
}

export async function unsubscribeFromWebPush(supabaseClient) {
  if (!(await isPushSupported())) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      if (supabaseClient && endpoint) {
        await supabaseClient.rpc("unsubscribe_push_subscription", {
          p_endpoint: endpoint,
        });
      }
    }

    toast.info("Push notifications disabled.");
    return true;
  } catch (error) {
    console.error("Failed to unsubscribe from Web Push:", error);
    return false;
  }
}
