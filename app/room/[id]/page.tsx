import Whiteboard from "@/components/Whiteboard";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Whiteboard roomId={id} />;
}
