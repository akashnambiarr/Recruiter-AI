export interface Candidate {
  id: string;
  name: string;
  status: "active" | "shortlisted" | "rejected";
  score: number;
  conversations: Message[];
}

export interface Message {
  id: string;
  sender: "ai" | "candidate";
  content: string;
  timestamp: string;
}

export interface JobDescription {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
}
