'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Send, 
  SkipForward, 
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronDown
} from "lucide-react";
import { fetchTopicDetails, fetchQuestion, submitAnswer } from "./api";
import styles from "./style.module.css";

type TopicDetail = {
  id: number;
  topic: string;
  topic_image: string;
  description: string;
  category: { id: number; category: string; category_image: string; description: string; };
  user_statistics?: { total_score: number; questions_asked: number; } | null;
};

type Review = {
  feedback: string;
  improved_answer: string;
  score: number;
};

export default function LearnTopic({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [review, setReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load topic details + first question
  useEffect(() => {
    if (!topicId) return;
    const loadData = async () => {
      try {
        const data = await fetchTopicDetails(Number(topicId));
        setTopic(data.data);
        await loadQuestion(difficulty);
      } catch (err) {
        console.error(err);
        setError("Failed to load topic details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [topicId]);

  const loadQuestion = async (diff: string) => {
    try {
      const res = await fetchQuestion(Number(topicId), diff);
      setQuestion(res.data.question.question);
      setAnswer("");
      setReview(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load question.");
    }
  };

  const handleSend = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await submitAnswer(Number(topicId), question, answer);
      const reviewData = res.data.review;
      setReview({
        feedback: reviewData.feedback,
        improved_answer: reviewData.improved_answer,
        score: reviewData.score,
      });
      const updatedTopic = await fetchTopicDetails(Number(topicId));
      setTopic(updatedTopic.data);
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    await loadQuestion(difficulty);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !submitting && answer.trim()) {
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} />
        <p>Loading topic details...</p>
      </div>
    );
  }

  if (error && !topic) {
    return (
      <div className={styles.errorContainer}>
        <XCircle className={styles.errorIcon} />
        <p className={styles.errorText}>{error}</p>
        <button onClick={() => router.back()} className={styles.errorBackBtn}>
          Go Back
        </button>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className={styles.errorContainer}>
        <XCircle className={styles.errorIcon} />
        <p className={styles.errorText}>Topic not found.</p>
        <button onClick={() => router.back()} className={styles.errorBackBtn}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        <ArrowLeft className={styles.backIcon} />
        Back to Topics
      </button>

      {/* Topic Header Card */}
      <div className={styles.topicCard}>
        <div className={styles.topicImageWrapper}>
          <img src={topic.topic_image} alt={topic.topic} className={styles.topicImage} />
          <div className={styles.topicOverlay}></div>
        </div>
        <div className={styles.topicContent}>
          <div className={styles.categoryTag}>{topic.category.category}</div>
          <h1 className={styles.topicTitle}>{topic.topic}</h1>
          <p className={styles.topicDescription}>{topic.description}</p>
        </div>
      </div>

      {/* Stats Section */}
      {topic.user_statistics && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <Trophy className={styles.statIcon} />
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Score</p>
              <p className={styles.statValue}>{topic.user_statistics.total_score}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <Target className={styles.statIcon} />
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Questions Answered</p>
              <p className={styles.statValue}>{topic.user_statistics.questions_asked}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Learning Section */}
      <div className={styles.learningSection}>
        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <h2 className={styles.questionTitle}>Question</h2>
            <div className={styles.difficultyWrapper}>
              <label className={styles.difficultyLabel}>Difficulty</label>
              <div className={styles.selectWrapper}>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)} 
                  className={styles.difficultySelect}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <ChevronDown className={styles.selectChevron} />
              </div>
            </div>
          </div>

          <div className={styles.questionContent}>
            <p className={styles.questionText}>{question}</p>
          </div>

          <div className={styles.answerSection}>
            <label className={styles.answerLabel}>Your Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              className={styles.answerTextarea}
              placeholder="Type your answer here... (Ctrl + Enter to submit)"
              rows={6}
            />
            <p className={styles.answerHint}>Press Ctrl + Enter to submit quickly</p>
          </div>

          <div className={styles.actionButtons}>
            <button 
              onClick={handleSend} 
              className={styles.submitBtn} 
              disabled={submitting || !answer.trim()}
            >
              {submitting ? (
                <>
                  <Loader2 className={styles.btnIconSpinner} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className={styles.btnIcon} />
                  Submit Answer
                </>
              )}
            </button>
            <button onClick={handleNext} className={styles.nextBtn}>
              <SkipForward className={styles.btnIcon} />
              Next Question
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        {review && (
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackHeader}>
              <div className={styles.scoreSection}>
                {review.score >= 7 ? (
                  <CheckCircle2 className={styles.scoreIconGood} />
                ) : (
                  <XCircle className={styles.scoreIconPoor} />
                )}
                <div>
                  <h3 className={styles.feedbackTitle}>Your Result</h3>
                  <p className={styles.scoreText}>
                    Score: <span className={review.score >= 7 ? styles.scoreGood : styles.scorePoor}>
                      {review.score}/10
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.feedbackContent}>
              <div className={styles.feedbackItem}>
                <h4 className={styles.feedbackSubtitle}>
                  <Lightbulb className={styles.feedbackIcon} />
                  Feedback
                </h4>
                <p className={styles.feedbackText}>{review.feedback}</p>
              </div>

              <div className={styles.feedbackItem}>
                <h4 className={styles.feedbackSubtitle}>
                  <CheckCircle2 className={styles.feedbackIcon} />
                  Improved Answer
                </h4>
                <p className={styles.improvedAnswer}>{review.improved_answer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}