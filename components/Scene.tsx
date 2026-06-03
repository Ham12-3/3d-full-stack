"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import NoteCard from "./NoteCard";
import type { Card, Mode } from "@/lib/types";

type Props = {
  cards: Card[];
  selectedId: string | null;
  mode: Mode;
  onSelect: (id: string | null) => void;
  onMove: (id: string, position: [number, number, number]) => void;
  onRotate: (id: string, rotation: [number, number, number]) => void;
  onEditText: (id: string, text: string) => void;
};

export default function Scene({
  cards,
  selectedId,
  mode,
  onSelect,
  onMove,
  onRotate,
  onEditText,
}: Props) {
  // Toggle OrbitControls imperatively (synchronously) on drag start/end.
  // React state updates land too late — OrbitControls would grab the same
  // pointer-down and orbit the camera before the new value applied.
  const controls = useRef<OrbitControlsImpl>(null);

  return (
    <Canvas
      camera={{ position: [6, 5, 8], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#0b1120"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />

      <Grid
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#334155"
        cellColor="#1e293b"
        fadeDistance={45}
        infiniteGrid
        position={[0, 0, 0]}
      />

      {cards.map((card) => (
        <NoteCard
          key={card.id}
          card={card}
          selected={card.id === selectedId}
          mode={mode}
          onSelect={onSelect}
          onMove={onMove}
          onRotate={onRotate}
          onEditText={onEditText}
          onDragStateChange={(dragging) => {
            if (controls.current) controls.current.enabled = !dragging;
          }}
        />
      ))}

      <OrbitControls ref={controls} makeDefault enablePan />
    </Canvas>
  );
}
