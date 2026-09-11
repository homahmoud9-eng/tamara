"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushManager() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return; // Only subscribe logged in users

    const subscribeToPush = async () => {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!publicVapidKey) return;

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });
        }

        // Send subscription to backend
        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });
      } catch (error) {
        console.error("Error subscribing to push notifications:", error);
      }
    };

    // Ask for permission if not already granted/denied
    if (Notification.permission === "default") {
      // You might want to trigger this with a UI button instead of automatically
      // But for now, we'll try automatically or rely on the browser prompt
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          subscribeToPush();
        }
      });
    } else if (Notification.permission === "granted") {
      subscribeToPush();
    }
  }, [session]);

  return null;
}
