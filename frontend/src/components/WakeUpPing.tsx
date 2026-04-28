"use client";

import { useEffect } from "react";

/**
 * Invisible component that pings the Render backend on mount
 * to wake it from its cold-start sleep (~50s spin-up).
 * Placed in root layout so the ping fires on the very first page load.
 */
export default function WakeUpPing() {
  useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fire-and-forget — we don't care about the response,
    // we just need the request to reach Render so the dyno wakes up.
    fetch(`${API_URL}/api/health`, { method: "GET" }).catch(() => {
      // Silently ignore errors (backend might not be reachable in dev)
    });
  }, []);

  return null; // renders nothing
}
