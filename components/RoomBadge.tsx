"use client";

import Link from "next/link";
import { useState } from "react";

export default function RoomBadge({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80 shadow-lg backdrop-blur">
        <Link href="/" className="font-semibold text-white hover:text-indigo-300">
          3D Whiteboard
        </Link>
        <span className="text-white/30">·</span>
        <span>
          Room <span className="font-mono text-white">{roomId}</span>
        </span>
        <button
          onClick={copyLink}
          className="rounded bg-indigo-500 px-2 py-1 font-medium text-white transition hover:bg-indigo-400 active:scale-95"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
