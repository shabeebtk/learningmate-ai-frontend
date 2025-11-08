import CharacterChat from "@/components/CharacterChat";

type PageProps = {
  params: {
    character_id: string;
  };
};

export default function CharacterPage({ params }: PageProps) {
  return <CharacterChat characterId={params.character_id} />;
}