"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function newRoomId() {
  return crypto.randomUUID().slice(0, 8);
}

export default function Home() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");

  const createRoom = () => router.push(`/room/${newRoomId()}`);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const id = joinId.trim();
    if (id) router.push(`/room/${encodeURIComponent(id)}`);
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-[#0b1120] px-6 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          3D Whiteboard
        </h1>
        <p className="mt-3 max-w-md text-balance text-white/60">
          A collaborative whiteboard where note cards live in 3D space. Create a
          board and share the link to work together in real time.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <button
          onClick={createRoom}
          className="rounded-lg bg-indigo-500 px-4 py-3 font-medium text-white shadow-lg transition hover:bg-indigo-400 active:scale-[0.98]"
        >
          Create a board
        </button>

        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="h-px flex-1 bg-white/10" />
          or join with a code
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={joinRoom} className="flex gap-2">
          <input
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="board code"
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-indigo-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!joinId.trim()}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Join
          </button>
        </form>
      </div>
    </main>
  );
}
