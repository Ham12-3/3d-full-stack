"use client";

import { useCallback, useState } from "react";
import Scene from "@/components/Scene";
import Toolbar from "@/components/Toolbar";
import RoomBadge from "@/components/RoomBadge";
import type { Card, Mode } from "@/lib/types";

const COLORS = ["#fde68a", "#bfdbfe", "#bbf7d0", "#fbcfe8", "#ddd6fe"];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function Whiteboard({ roomId }: { roomId: string }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("move");

  const addCard = useCallback(() => {
    const id = crypto.randomUUID();
    setCards((prev) => [
      ...prev,
      {
        id,
        text: "New note",
        position: [rand(-3, 3), rand(0.5, 3), rand(-2, 2)],
        rotation: [0, 0, 0],
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
    setSelectedId(id);
  }, []);

  const deleteSelected = useCallback(() => {
    setSelectedId((current) => {
      if (current) setCards((prev) => prev.filter((c) => c.id !== current));
      return null;
    });
  }, []);

  const moveCard = useCallback(
    (id: string, position: [number, number, number]) =>
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, position } : c))
      ),
    []
  );

  const rotateCard = useCallback(
    (id: string, rotation: [number, number, number]) =>
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, rotation } : c))
      ),
    []
  );

  const editText = useCallback(
    (id: string, text: string) =>
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, text } : c))),
    []
  );

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Scene
        cards={cards}
        selectedId={selectedId}
        mode={mode}
        onSelect={setSelectedId}
        onMove={moveCard}
        onRotate={rotateCard}
        onEditText={editText}
      />
      <Toolbar
        onAdd={addCard}
        onDelete={deleteSelected}
        canDelete={!!selectedId}
        count={cards.length}
        mode={mode}
        onModeChange={setMode}
      />
      <RoomBadge roomId={roomId} />
    </main>
  );
}
