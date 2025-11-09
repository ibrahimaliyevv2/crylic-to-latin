import React from "react";
import { Type } from "lucide-react";

const Header: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Type className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Azerbaijani Alphabet
        </h1>
      </div>
      <p className="text-gray-600 text-lg">
        Cyrillic to Latin Azerbaijani Converter
      </p>
    </div>
  );
};

export default Header;
