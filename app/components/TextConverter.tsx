import React from "react";

interface TextConverterProps {
  inputText: string;
  outputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextConverter: React.FC<TextConverterProps> = ({
  inputText,
  outputText,
  onInputChange,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Cyrillic</h2>
        </div>
        <textarea
          value={inputText}
          onChange={onInputChange}
          placeholder="Enter text in Cyrillic script..."
          className="w-full h-96 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none font-mono text-lg"
        />
        <div className="mt-2 text-sm text-gray-500">
          {inputText.length} characters
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Latin</h2>
        </div>
        <textarea
          value={outputText}
          readOnly
          placeholder="Converted text will appear here..."
          className="w-full h-96 p-4 border-2 border-gray-200 rounded-xl bg-gray-50 resize-none font-mono text-lg"
        />
        <div className="mt-2 text-sm text-gray-500">
          {outputText.length} characters
        </div>
      </div>
    </div>
  );
};

export default TextConverter;
