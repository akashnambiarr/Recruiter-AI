import { useState, useCallback } from "react";
import type { Candidate, Message } from "../types";
import { getChatResponse } from "../services/api";
import { saveToStorage } from "../services/storage";

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (
      message: string,
      candidate: Candidate,
      candidates: Candidate[],
      setCandidates: (candidates: Candidate[]) => void,
      setSelectedCandidate: (candidate: Candidate | null) => void,
    ) => {
      if (!message.trim()) return;

      setIsLoading(true);
      setError(null);

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "candidate",
        content: message.trim(),
        timestamp: new Date().toISOString(),
      };

      try {
        const updatedCandidates = candidates.map((c) =>
          c.id === candidate.id
            ? {
                ...c,
                conversations: [...c.conversations, newMessage],
              }
            : c,
        );

        setCandidates(updatedCandidates);
        setSelectedCandidate(
          updatedCandidates.find((c) => c.id === candidate.id) || null,
        );

        const aiResponse = await getChatResponse([
          ...candidate.conversations,
          newMessage,
        ]);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        const finalCandidates = updatedCandidates.map((c) =>
          c.id === candidate.id
            ? {
                ...c,
                conversations: [...c.conversations, aiMessage],
              }
            : c,
        );

        setCandidates(finalCandidates);
        setSelectedCandidate(
          finalCandidates.find((c) => c.id === candidate.id) || null,
        );
        saveToStorage(finalCandidates);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get AI response",
        );
        console.error("Chat error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearChat = useCallback(
    (
      candidate: Candidate,
      candidates: Candidate[],
      setCandidates: (candidates: Candidate[]) => void,
      setSelectedCandidate: (candidate: Candidate | null) => void,
    ) => {
      const updatedCandidate = {
        ...candidate,
        conversations: [],
      };

      const clearedCandidates = candidates.map((c) =>
        c.id === candidate.id ? updatedCandidate : c,
      );

      setCandidates(clearedCandidates);
      setSelectedCandidate(
        clearedCandidates.find((c) => c.id === candidate.id) || null,
      );
      saveToStorage(clearedCandidates);
    },
    [],
  );

  return {
    sendMessage,
    clearChat,
    isLoading,
    error,
  };
}
