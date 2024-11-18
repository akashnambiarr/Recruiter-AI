import React from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';
import type { JobDescription } from '../types';

interface JobDescriptionPanelProps {
  jobDescription: JobDescription;
}

export default function JobDescriptionPanel({
  jobDescription,
}: JobDescriptionPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Briefcase className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Job Description</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{jobDescription.title}</h3>
          <p className="text-gray-600">{jobDescription.description}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Requirements</h4>
          <ul className="space-y-2">
            {jobDescription.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {jobDescription.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}