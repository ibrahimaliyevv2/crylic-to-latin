"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { convertText } from "./utils/conversion";
import Header from "./components/Header";
import FileUploader from "./components/FileUploader";
import TextConverter from "./components/TextConverter";
import ActionButtons from "./components/ActionButtons";
import Instructions from "./components/Instructions";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setOutputText(convertText(text));
    setError("");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setFileName("");
    setFileType("");
    setOriginalFile(null);
    setError("");
  };

  const extractTextFromPDF = async (file: File) => {
    if (!pdfLoaded || !window.pdfjsLib) {
      throw new Error("PDF library not loaded");
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
        throw new Error("No text found in PDF");
      }

      return fullText;
    } catch (err: unknown) {
      console.error("PDF oxuma xətası:", err);
      throw new Error(`Could not read PDF file: ${(err as Error).message}`);
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
          throw new Error("PDF library is still loading");
        }
        text = await extractTextFromPDF(file);
      } else {
        const reader = new FileReader();
        text = await new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = () => reject(new Error("Could not read file"));
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
      throw new Error("PDF library not loaded");
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
      setError(`Download error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        <FileUploader
          isLoading={isLoading}
          fileName={fileName}
          fileType={fileType}
          pdfLoaded={pdfLoaded}
          onFileUpload={handleFileUpload}
        />

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <TextConverter
          inputText={inputText}
          outputText={outputText}
          onInputChange={handleInputChange}
        />

        <ActionButtons
          outputText={outputText}
          isLoading={isLoading}
          fileType={fileType}
          onDownload={handleDownload}
          onClear={handleClear}
        />

        <Instructions />
      </div>
    </div>
  );
}
