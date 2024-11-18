import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import type { Candidate, JobDescription } from "./types";
import ChatWindow from "./components/ChatWindow";
import CandidateList from "./components/CandidateList";
import JobDescriptionPanel from "./components/JobDescriptionPanel";
import { useChat } from "./hooks/useChat";
import { loadFromStorage } from "./services/storage";

const mockJobDescription: JobDescription = {
  title: "Senior Full Stack Developer",
  description:
    "We're looking for an experienced Full Stack Developer to join our growing team. The ideal candidate will have a strong background in both frontend and backend development, with a passion for creating scalable web applications.",
  requirements: [
    "5+ years of experience in full stack development",
    "Strong proficiency in React, Node.js, and TypeScript",
    "Experience with cloud platforms (AWS/GCP/Azure)",
    "Knowledge of microservices architecture",
  ],
  skills: [
    "React",
    "Node.js",
    "TypeScript",
    "AWS",
    "Docker",
    "MongoDB",
    "GraphQL",
  ],
};

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "John Smith",
    status: "active",
    score: 8.5,
    conversations: [
      {
        id: "1",
        sender: "ai",
        content:
          "Hello! I'm the AI recruiter. Could you tell me about your experience with React and Node.js?",
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    status: "shortlisted",
    score: 9.2,
    conversations: [],
  },
  {
    id: "3",
    name: "Michael Brown",
    status: "rejected",
    score: 6.4,
    conversations: [],
  },
];

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const { sendMessage, clearChat, isLoading, error } = useChat();

  useEffect(() => {
    const savedCandidates = loadFromStorage();
    if (savedCandidates) {
      setCandidates(savedCandidates);
      setSelectedCandidate(savedCandidates[0]);
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!selectedCandidate) return;
    await sendMessage(
      message,
      selectedCandidate,
      candidates,
      setCandidates,
      setSelectedCandidate,
    );
  };

  const handleClearChat = (candidate: Candidate) => {
    clearChat(candidate, candidates, setCandidates, setSelectedCandidate);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Recruiter AI</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <CandidateList
              candidates={candidates}
              selectedCandidate={selectedCandidate}
              onSelectCandidate={setSelectedCandidate}
              clearChat={handleClearChat}
              setCandidates={setCandidates}
              setSelectedCandidate={setSelectedCandidate}
            />
          </div>

          <div className="col-span-6 h-[calc(100vh-12rem)]">
            {selectedCandidate ? (
              <ChatWindow
                candidate={selectedCandidate}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
                <p className="text-gray-500">
                  Select a candidate to start chatting
                </p>
              </div>
            )}
          </div>

          <div className="col-span-3">
            <JobDescriptionPanel jobDescription={mockJobDescription} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
