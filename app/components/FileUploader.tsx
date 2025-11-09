import React from "react";
import { Upload, FileText } from "lucide-react";

interface FileUploaderProps {
  isLoading: boolean;
  fileName: string;
  fileType: string;
  pdfLoaded: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  isLoading,
  fileName,
  fileType,
  pdfLoaded,
  onFileUpload,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <label
          className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="w-5 h-5" />
          <span>{isLoading ? "Loading..." : "Upload File"}</span>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileUpload}
            disabled={isLoading}
            className="hidden"
          />
        </label>
        {fileName && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
            <FileText className="w-4 h-4" />
            <span>{fileName}</span>
            {fileType && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">
                {fileType}
              </span>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">
        Supports TXT, PDF, DOC, DOCX files
      </p>
      {!pdfLoaded && (
        <p className="text-center text-xs text-amber-600 mt-2">
          Loading libraries...
        </p>
      )}
    </div>
  );
};

export default FileUploader;
