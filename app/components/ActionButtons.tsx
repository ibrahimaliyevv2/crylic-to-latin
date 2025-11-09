import React from "react";
import { Download } from "lucide-react";

interface ActionButtonsProps {
  outputText: string;
  isLoading: boolean;
  fileType: string;
  onDownload: () => void;
  onClear: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  outputText,
  isLoading,
  fileType,
  onDownload,
  onClear,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={onDownload}
        disabled={!outputText || isLoading}
        className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
      >
        <Download className="w-5 h-5" />
        <span>{fileType === "pdf" ? "Download PDF" : "Download TXT"}</span>
      </button>
      <button
        onClick={onClear}
        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-md"
      >
        Clear
      </button>
    </div>
  );
};

export default ActionButtons;
