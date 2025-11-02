export async function fetchTopicDetails(topicId: number) {
  const res = await fetch(`/api/learn/topic/${topicId}/details`);
  if (!res.ok) throw new Error("Failed to fetch topic details");
  return res.json();
}

export async function fetchQuestion(topicId: number, difficulty: string) {
  const res = await fetch(`/api/learn/generate/${topicId}/question?difficulty=${difficulty}`);
  if (!res.ok) throw new Error("Failed to fetch question");
  return res.json();
}

export async function submitAnswer(topicId: number, question: string, answer: string) {
  const res = await fetch(`/api/learn/question/answer/result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic_id: topicId, question, answer }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}
