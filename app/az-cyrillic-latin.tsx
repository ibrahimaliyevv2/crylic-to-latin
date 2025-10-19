"use client";

import React, { useState, useEffect } from "react";
import { Download, Upload, Type, FileText, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    pdfjsLib: any;
    jspdf: any;
  }
}

export default function AzerbaijaniConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfLoaded, setPdfLoaded] = useState(false);

  const conversionMap = {
    А: "A",
    а: "a",
    Б: "B",
    б: "b",
    В: "V",
    в: "v",
    Г: "Q",
    г: "q",
    Ғ: "Ğ",
    ғ: "ğ",
    Д: "D",
    д: "d",
    Е: "E",
    е: "e",
    Ә: "Ə",
    ә: "ə",
    Ж: "J",
    ж: "j",
    З: "Z",
    з: "z",
    И: "İ",
    и: "i",
    Ы: "I",
    ы: "ı",
    Й: "Y",
    й: "y",
    К: "K",
    к: "k",
    Ҝ: "G",
    ҝ: "g",
    Л: "L",
    л: "l",
    М: "M",
    м: "m",
    Н: "N",
    н: "n",
    О: "O",
    о: "o",
    Ө: "Ö",
    ө: "ö",
    П: "P",
    п: "p",
    Р: "R",
    р: "r",
    С: "S",
    с: "s",
    Т: "T",
    т: "t",
    У: "U",
    у: "u",
    Ү: "Ü",
    ү: "ü",
    Ф: "F",
    ф: "f",
    Х: "X",
    х: "x",
    Һ: "H",
    һ: "h",
    Ч: "Ç",
    ч: "ç",
    Ҹ: "C",
    ҹ: "c",
    Ш: "Ş",
    ш: "ş",
    Ь: "",
    ь: "",
    Ј: "Y",
    ј: "y",
    Э: "E",
    э: "e",
  };

  useEffect(() => {
    const loadPdfJs = () => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          setPdfLoaded(true);
        }
      };
      document.head.appendChild(script);
    };

    const loadJsPdf = () => {
      const script1 = document.createElement("script");
      script1.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      document.head.appendChild(script1);
    };

    if (!window.pdfjsLib) loadPdfJs();
    else setPdfLoaded(true);

    if (!window.jspdf) loadJsPdf();
  }, []);

  const convertText = (text: string) => {
    return text
      .split("")
      .map((char: string) => (conversionMap as any)[char] || char)
      .join("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setOutputText(convertText(text));
    setError("");
  };

  const extractTextFromPDF = async (file: File) => {
    if (!pdfLoaded || !window.pdfjsLib) {
      throw new Error("PDF kitabxanası yüklənməyib / PDF library not loaded");
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }

      if (!fullText.trim()) {
        throw new Error("PDF faylında mətn tapılmadı / No text found in PDF");
      }

      return fullText;
    } catch (err: unknown) {
      console.error("PDF oxuma xətası:", err);
      throw new Error(
        `PDF faylını oxumaq mümkün olmadı: ${(err as Error).message}`
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalFile(file);
    setIsLoading(true);
    setError("");

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    setFileType(fileExtension);

    try {
      let text = "";

      if (file.type === "application/pdf" || fileExtension === "pdf") {
        if (!pdfLoaded) {
          throw new Error(
            "PDF kitabxanası hələ yüklənir / PDF library is still loading"
          );
        }
        text = await extractTextFromPDF(file);
      } else {
        const reader = new FileReader();
        text = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = () =>
            reject(
              new Error("Fayl oxumaq mümkün olmadı / Could not read file")
            );
          reader.readAsText(file, "UTF-8");
        });
      }

      setInputText(text);
      setOutputText(convertText(text));
    } catch (err: unknown) {
      setError((err as Error).message);
      setInputText("");
      setOutputText("");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async (text: string) => {
    if (!window.jspdf) {
      throw new Error("PDF kitabxanası yüklənməyib");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 7;

    // Use Times for better Azerbaijani character support
    doc.setFont("times", "normal");
    doc.setFontSize(11);

    const paragraphs = text.split("\n");
    let y = margin;

    paragraphs.forEach((paragraph: string) => {
      if (!paragraph.trim()) {
        y += lineHeight;
        return;
      }

      const lines = doc.splitTextToSize(paragraph, maxWidth);

      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      y += 3; // Extra space between paragraphs
    });

    return doc.output("blob");
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      let blob;
      let downloadFileName;

      if (fileType === "pdf") {
        blob = await generatePDF(outputText);
        downloadFileName = fileName.replace(".pdf", "_latin.pdf");
      } else {
        blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
        if (fileType === "txt") {
          downloadFileName = fileName.replace(".txt", "_latin.txt");
        } else if (fileType === "doc" || fileType === "docx") {
          downloadFileName = fileName.replace(/\.(doc|docx)$/i, "_latin.txt");
        } else {
          downloadFileName = `${fileName.replace(/\.[^.]+$/, "")}_latin.txt`;
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(`Yükləmə xətası / Download error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setFileName("");
    setFileType("");
    setOriginalFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Type className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Azərbaycan Əlifbası
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Kiril əlifbasından Latin əlifbasına çevirici
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Cyrillic to Latin Azerbaijani Converter
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <label
              className={`flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>
                {isLoading
                  ? "Yüklənir... / Loading..."
                  : "Fayl yüklə / Upload File"}
              </span>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
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
            TXT, PDF, DOC, DOCX faylları dəstəklənir / Supports TXT, PDF, DOC,
            DOCX files
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            PDF formatında yüklənər: PDF / TXT formatında yüklənər: TXT, DOC,
            DOCX
          </p>
          {!pdfLoaded && (
            <p className="text-center text-xs text-amber-600 mt-2">
              Kitabxanalar yüklənir... / Loading libraries...
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Kiril / Cyrillic
              </h2>
            </div>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="Kiril əlifbasında olan mətni daxil edin..."
              className="w-full h-96 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none font-mono text-lg"
            />
            <div className="mt-2 text-sm text-gray-500">
              {inputText.length} simvol / characters
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Latin / Latin
              </h2>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Çevrilmiş mətn burada görünəcək..."
              className="w-full h-96 p-4 border-2 border-gray-200 rounded-xl bg-gray-50 resize-none font-mono text-lg"
            />
            <div className="mt-2 text-sm text-gray-500">
              {outputText.length} simvol / characters
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={!outputText || isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
          >
            <Download className="w-5 h-5" />
            <span>
              {fileType === "pdf"
                ? "Yüklə PDF / Download PDF"
                : "Yüklə TXT / Download TXT"}
            </span>
          </button>
          <button
            onClick={handleClear}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-md"
          >
            Təmizlə / Clear
          </button>
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            İstifadə qaydası / How to use:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Mətn sahəsinə birbaşa yazın və ya fayl yükləyin</li>
            <li>
              • Enter text directly or upload a file (TXT, PDF, DOC, DOCX)
            </li>
            <li>
              • <strong>PDF yüklənir:</strong> PDF formatında /{" "}
              <strong>PDF uploads:</strong> Download as PDF
            </li>
            <li>
              • <strong>TXT/DOC/DOCX yüklənir:</strong> TXT formatında /{" "}
              <strong>TXT/DOC/DOCX uploads:</strong> Download as TXT
            </li>
            <li>• Çevrilmiş mətni yükləmək üçün düyməni basın</li>
            <li>• Click download button to save the converted file</li>
            <li className="text-sm text-gray-600">
              • PDF faylları üçün mətn təbəqəsi olmalıdır (skan deyil)
            </li>
            <li className="text-sm text-gray-600">
              • PDFs must contain text layer (not scanned images)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
