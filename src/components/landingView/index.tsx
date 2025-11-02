'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  Code,
  Atom,
  Calculator,
  Scroll,
  Target,
  MessageCircle,
  Brain,
  Zap,
  ArrowRight,
  Check
} from "lucide-react";
import styles from "./style.module.css"
import AuthModal from "../AuthModal";

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthClick = () => {
    // Add your authentication logic here
    console.log('Auth button clicked');
  };

  const categories = [
    {
      icon: <Code size={32} />,
      title: "Programming Languages",
      description: "Learn Python, JavaScript, and more through fun AI quizzes.",
      color: "#1d4ed8"
    },
    {
      icon: <Atom size={32} />,
      title: "Science",
      description: "Explore Physics, Chemistry, and Biology with interactive learning.",
      color: "#059669"
    },
    {
      icon: <Calculator size={32} />,
      title: "Mathematics",
      description: "Solve Algebra, Geometry, and Calculus problems with real-time feedback.",
      color: "#f97316"
    },
    {
      icon: <Scroll size={32} />,
      title: "History",
      description: "Discover world history through engaging AI challenges.",
      color: "#dc2626"
    }
  ];

  const steps = [
    {
      icon: <BookOpen size={40} />,
      title: "Pick a Topic",
      description: "Select from hundreds of subjects and skill levels."
    },
    {
      icon: <MessageCircle size={40} />,
      title: "Chat with AI",
      description: "Answer questions and discuss concepts with your personal AI tutor."
    },
    {
      icon: <Target size={40} />,
      title: "Get Feedback & Score",
      description: "Learn from instant explanations and track your progress."
    }
  ];

  const features = [
    {
      icon: <Target size={28} />,
      title: "Personalized Learning",
      description: "Adapts to your level and pace."
    },
    {
      icon: <MessageCircle size={28} />,
      title: "Conversational Feedback",
      description: "Feels like chatting with a real tutor."
    },
    {
      icon: <Brain size={28} />,
      title: "Smart Scoring",
      description: "See your strengths and weaknesses instantly."
    },
    {
      icon: <Zap size={28} />,
      title: "Engaging & Fun",
      description: "Turn studying into an interactive experience."
    }
  ];

  return (
    <div className={styles.container}>
      {/* Navigation Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <Sparkles size={24} />
            <span>LearningMate AI</span>
          </Link>
          <div className={styles.authButtons}>
            <button onClick={() => setIsAuthModalOpen(true)} className={styles.loginBtn}>
              Login
            </button>
            <button onClick={() => setIsAuthModalOpen(true)} className={styles.signupBtn}>
              Signup
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.badge}>
              <Sparkles size={16} />
              <span>Powered by AI</span>
            </div>
            <h1 className={styles.heroTitle}>
              Learn Smarter with AI — Your Personal Study Mate Awaits!
            </h1>
            <p className={styles.heroSubtitle}>
              Choose a topic, answer interactive AI questions, and get instant feedback that helps you master any subject.
            </p>
            <div className={styles.heroCTA}>
              <Link href="/learn/categories" className={styles.btnPrimary}>
                Start Learning
                <ArrowRight size={20} />
              </Link>
              <Link href="/learn/categories" className={styles.btnSecondary}>
                Explore Categories
              </Link>
            </div>
            <p className={styles.heroTagline}>
              <Check size={16} />
              Free to start. Personalized by AI.
            </p>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroIllustration}>
              <Brain size={120} className={styles.brainIcon} />
              <div className={styles.floatingCard} style={{ top: '10%', left: '10%' }}>
                <Code size={24} />
              </div>
              <div className={styles.floatingCard} style={{ top: '60%', right: '10%' }}>
                <Atom size={24} />
              </div>
              <div className={styles.floatingCard} style={{ bottom: '10%', left: '20%' }}>
                <Calculator size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose What You Want to Learn</h2>
          <p className={styles.sectionSubtitle}>
            Explore diverse subjects and start your learning journey today
          </p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category, index) => (
            <div key={index} className={styles.categoryCard}>
              <div className={styles.categoryIcon} style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              <p className={styles.categoryDescription}>{category.description}</p>
              <Link href="/learn/categories" className={styles.categoryLink}>
                View Topics
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
        <div className={styles.sectionCTA}>
          <Link href="/learn/categories" className={styles.btnOutline}>
            View All Categories
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How LearningMate AI Works</h2>
          <p className={styles.sectionSubtitle}>
            Start learning in three simple steps
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepIcon}>
                {step.icon}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.sectionCTA}>
          <Link href="/learn/categories" className={styles.btnPrimary}>
            Try a Demo Quiz
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Students Love LearningMate AI</h2>
          <p className={styles.sectionSubtitle}>
            Experience the future of personalized learning
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCTA}>
        <div className={styles.finalCTAContent}>
          <h2 className={styles.finalCTATitle}>Ready to Learn Smarter?</h2>
          <p className={styles.finalCTASubtitle}>
            Join thousands of learners using AI to master new skills every day.
          </p>
          <div className={styles.finalCTAButtons}>
            <Link href="/learn/categories" className={styles.btnWhite}>
              Start Learning for Free
            </Link>
            <Link href="/learn/categories" className={styles.btnOutlineWhite}>
              Explore Topics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
          <p className={styles.footerCopyright}>
            © 2025 LearningMate AI — Learn, Practice, and Grow Smarter.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

    </div>
  );
}