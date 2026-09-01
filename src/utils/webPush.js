import { toast } from "./toast";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();

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

export async function subscribeToWebPush(supabaseClient) {
  if (!(await isPushSupported())) {
    toast.warning("Browser push notifications are not supported on this device.");
    return null;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn("VITE_VAPID_PUBLIC_KEY is not configured.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.warning("Notification permission was denied.");
      return null;
    }

    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await navigator.serviceWorker.register('/sw.js');
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
      }
    );

    if (rpcError) {
      console.error("RPC register_push_subscription error:", rpcError);
      throw rpcError;
    }

    toast.success("Background Utsavam alerts enabled!");
    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to Web Push:", error);
    toast.error("Could not register push subscription.");
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
