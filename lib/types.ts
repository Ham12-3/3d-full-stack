export type Card = {
  id: string;
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

export type Mode = "move" | "rotate";
