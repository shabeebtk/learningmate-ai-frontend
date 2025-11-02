// app/learn/topics/[topic_id]/page.tsx
import LearnTopic from "@/components/LearnTopic";

export default function TopicPage({ params }: { params: { topic_Id: string } }) {

  console.log(params)
  const { topic_Id } = params;

  console.log("id in page", topic_Id); 

  return (
    <div className="">
      <LearnTopic topicId={topic_Id} />
    </div>
  );
}
