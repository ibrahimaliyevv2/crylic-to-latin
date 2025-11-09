import React from "react";

const Instructions: React.FC = () => {
  return (
    <div className="mt-12 bg-blue-50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">How to use:</h3>
      <ul className="space-y-2 text-gray-700">
        <li>• Enter text directly or upload a file (TXT, PDF, DOC, DOCX)</li>
        <li className="text-sm text-gray-600">
          • PDFs must contain text layer (not scanned images)
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
