"use client";

import type { Mode } from "@/lib/types";

type Props = {
  onAdd: () => void;
  onDelete: () => void;
  canDelete: boolean;
  count: number;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export default function Toolbar({
  onAdd,
  onDelete,
  canDelete,
  count,
  mode,
  onModeChange,
}: Props) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onAdd}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-indigo-400 active:scale-95"
          >
            + Add card
          </button>
          <button
            onClick={onDelete}
            disabled={!canDelete}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete selected
          </button>

          <div className="ml-2 flex items-center rounded-lg bg-white/10 p-1 shadow-lg backdrop-blur">
            {(["move", "rotate"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition ${
                  mode === m
                    ? "bg-indigo-500 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <span className="pointer-events-auto rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur">
          {count} {count === 1 ? "card" : "cards"}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-center text-xs text-white/50">
        {mode === "move"
          ? "Drag to orbit · scroll to zoom · click a card to select, drag to move, double-click to edit"
          : "Select a card, then drag the rings to rotate · switch to Move to reposition"}
      </div>
    </>
  );
}
