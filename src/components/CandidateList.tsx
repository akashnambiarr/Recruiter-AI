import { Users, Star, XCircle } from "lucide-react";
import type { Candidate } from "../types";

interface CandidateListProps {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  onSelectCandidate: (candidate: Candidate) => void;
  clearChat: (candidate: Candidate) => void;
  setCandidates: (candidates: Candidate[]) => void;
  setSelectedCandidate: (candidate: Candidate | null) => void;
}

export default function CandidateList({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  clearChat,
}: CandidateListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Candidates</h2>
      </div>
      <div className="space-y-2">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="flex items-center space-x-2">
            <button
              onClick={() => onSelectCandidate(candidate)}
              className={`flex-1 p-3 rounded-lg text-left transition-colors ${
                selectedCandidate?.id === candidate.id
                  ? "bg-blue-50 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {candidate.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-500">
                      Score: {candidate.score.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {candidate.status === "shortlisted" ? (
                    <Star className="w-5 h-5 text-yellow-500" />
                  ) : candidate.status === "rejected" ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : null}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearChat(candidate);
                    }}
                    className="p-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
