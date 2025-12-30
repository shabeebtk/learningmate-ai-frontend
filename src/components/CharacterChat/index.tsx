'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  ArrowLeft,
  Send,
  Loader2,
  User,
  Bot,
  Info
} from "lucide-react";
import styles from "./style.module.css";

type Topic = {
  id: number;
  topic: string;
  topic_image: string;
};

type Character = {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  is_active: boolean;
  topic: Topic;
};

type Message = {
  id: number;
  sender: "user" | "ai";
  message: string;
  created_at: string;
  user: number;
  ai_character: number;
};

type CharacterChatProps = {
  characterId: string;
};

export default function CharacterChat({ characterId }: CharacterChatProps) {
  const router = useRouter();
  const { user, authenticating } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const initialScrollDone = useRef(false);
  const prevScrollHeight = useRef(0);

  // Fetch character details
  const fetchCharacterDetails = async () => {
    try {
      const res = await fetch(`/api/ai-characters/${characterId}/details`);
      const data = await res.json();
      if (data.success) {
        setCharacter(data.data.character);
      }
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  };

  // Fetch messages
  const fetchMessages = async (reset = false) => {
    if (!reset && (!hasMore || loadingMore)) return;

    const currentOffset = reset ? 0 : offset;
    setLoadingMore(true);

    try {
      const res = await fetch(
        `/api/ai-characters/${characterId}/chat/messages?limit=20&offset=${currentOffset}`
      );
      const data = await res.json();

      if (data.success) {
        const newMessages = data.data.data;

        if (reset) {
          setMessages(newMessages);
          setOffset(20);
        } else {
          // Prepend older messages
          setMessages(prev => [...newMessages, ...prev]);
          setOffset(prev => prev + 20);
        }

        setHasMore(data.data.next_offset !== null);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  function normalizeNewlines(text: string): string {
    // Replace 3 or more consecutive newlines (with spaces) with just 2
    return text.replace(/(\n\s*){3,}/g, "\n\n").trim();
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    // Clean up message before sending
    const messageText = normalizeNewlines(newMessage);

    if (!messageText) return; // ignore if becomes empty

    setNewMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setSending(true);

    try {
      const res = await fetch("/api/ai-characters/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character_id: parseInt(characterId),
          message: messageText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Add user message and AI response
        const userMsg: Message = {
          id: Date.now(),
          sender: "user",
          message: messageText,
          created_at: new Date().toISOString(),
          user: 1,
          ai_character: parseInt(characterId),
        };

        const aiMsg: Message = {
          id: Date.now() + 1,
          sender: "ai",
          message: data.data.response,
          created_at: new Date().toISOString(),
          user: 1,
          ai_character: parseInt(characterId),
        };

        setMessages(prev => [...prev, userMsg, aiMsg]);

        // Scroll to bottom after new message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Handle scroll to load more messages
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // If user scrolls to top, load more messages
    if (container.scrollTop === 0 && hasMore && !loadingMore) {
      prevScrollHeight.current = container.scrollHeight;
      fetchMessages(false);
    }
  };

  // Restore scroll position after loading more messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && prevScrollHeight.current > 0 && loadingMore === false) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    }
  }, [messages, loadingMore]);

  // Initial load
  useEffect(() => {
    fetchCharacterDetails();
    fetchMessages(true);
  }, [characterId]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!loading && !initialScrollDone.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      initialScrollDone.current = true;
    }
  }, [loading, messages]);

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto"; // reset height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // grow up to max height
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} />
        <p>Loading chat...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={styles.errorContainer}>
        <p>Character not found</p>
        <button onClick={() => router.back()} className={styles.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.characterInfo}>
          <img src={character.avatar} alt={character.name} className={styles.avatar} />
          <div className={styles.characterDetails}>
            <h2 className={styles.characterName}>{character.name}</h2>
            <p className={styles.characterRole}>{character.role} • {character.topic.topic}</p>
          </div>
        </div>
        <button className={styles.infoButton} title={character.description}>
          <Info size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loadingMore && (
          <div className={styles.loadingMore}>
            <Loader2 className={styles.loadingMoreSpinner} />
            <span>Loading more messages...</span>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageWrapper} ${msg.sender === "user" ? styles.userMessage : styles.aiMessage
              }`}
          >
            <div className={styles.messageAvatar}>
              {msg.sender === "user" ? (
                <div className={styles.userAvatar}>
                  {user && user.profile_img ?
                    <img src={user?.profile_img || ""} alt={user?.name || "User avatar"} className={styles.userAvatar} />
                    :
                    <User size={18} />
                  }
                </div>
              ) : (
                <img src={character.avatar} alt={character.name} className={styles.aiAvatar} />
              )}
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{msg.message}</p>
              </div>
              <span className={styles.messageTime}>
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${character.name}...`}
            className={styles.input}
            rows={1}
            disabled={sending}
          />

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={styles.sendButton}
          >
            {sending ? (
              <Loader2 className={styles.sendingSpinner} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        <p className={styles.inputHint}>Press Enter to send, Shift + Enter for new line</p>
      </div>
    </div>
  );
}