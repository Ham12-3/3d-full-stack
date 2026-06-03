"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Text, RoundedBox, TransformControls } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import type { Card, Mode } from "@/lib/types";

type Props = {
  card: Card;
  selected: boolean;
  mode: Mode;
  onSelect: (id: string) => void;
  onMove: (id: string, position: [number, number, number]) => void;
  onRotate: (id: string, rotation: [number, number, number]) => void;
  onEditText: (id: string, text: string) => void;
  onDragStateChange: (dragging: boolean) => void;
};

const CARD_W = 2.2;
const CARD_H = 1.4;

export default function NoteCard({
  card,
  selected,
  mode,
  onSelect,
  onMove,
  onRotate,
  onEditText,
  onDragStateChange,
}: Props) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Drag bookkeeping kept in refs so it never triggers re-renders mid-drag.
  const dragging = useRef(false);
  const plane = useRef(new THREE.Plane());
  const normal = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const hit = useRef(new THREE.Vector3());

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect(card.id);
    // In rotate mode the gizmo rings handle the gesture; don't translate.
    if (mode !== "move") return;

    dragging.current = true;
    onDragStateChange(true);
    (e.target as unknown as Element).setPointerCapture(e.pointerId);

    const origin = new THREE.Vector3(...card.position);
    camera.getWorldDirection(normal.current);
    plane.current.setFromNormalAndCoplanarPoint(normal.current, origin);
    offset.current.copy(e.point).sub(origin);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    if (e.ray.intersectPlane(plane.current, hit.current)) {
      const p = hit.current.sub(offset.current);
      onMove(card.id, [p.x, p.y, p.z]);
    }
  };

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    dragging.current = false;
    onDragStateChange(false);
    (e.target as unknown as Element).releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const next = window.prompt("Edit note", card.text);
    if (next !== null) onEditText(card.id, next);
  };

  // After a gizmo rotation, read the live euler back into app state.
  const commitRotation = () => {
    const g = groupRef.current;
    if (g) onRotate(card.id, [g.rotation.x, g.rotation.y, g.rotation.z]);
  };

  const cardGroup = (
    <group
      ref={groupRef}
      position={card.position}
      rotation={card.rotation}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={handleDoubleClick}
    >
      <RoundedBox args={[CARD_W, CARD_H, 0.08]} radius={0.08}>
        {/* Selection = emissive indigo glow. Keeps the card's color and text
            readable and never occludes the card from any viewing angle. */}
        <meshStandardMaterial
          color={card.color}
          roughness={0.6}
          emissive="#6366f1"
          emissiveIntensity={selected ? 0.6 : 0}
        />
      </RoundedBox>

      {/* Text on both faces so the note is readable from front and back. */}
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.26}
        lineHeight={1.15}
        maxWidth={CARD_W * 0.85}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {card.text}
      </Text>
      <Text
        position={[0, 0, -0.05]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.26}
        lineHeight={1.15}
        maxWidth={CARD_W * 0.85}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {card.text}
      </Text>
    </group>
  );

  if (selected && mode === "rotate") {
    return (
      <TransformControls mode="rotate" onMouseUp={commitRotation}>
        {cardGroup}
      </TransformControls>
    );
  }

  return cardGroup;
}
