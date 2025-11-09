# Azerbaijani Cyrillic to Latin Converter

An application for converting Azerbaijani text from Cyrillic script to Latin script. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Conversion**: Convert text as you type with instant preview
- **File Upload Support**: Upload and convert TXT, PDF, DOC, and DOCX files
- **Processing**: Extract text from PDF files and convert to Latin script

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Processing**: PDF.js and jsPDF libraries

## Project Structure

```
crylic-to-latin/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # App header with title
│   │   ├── FileUploader.tsx    # File upload interface
│   │   ├── TextConverter.tsx   # Text input/output areas
│   │   ├── ActionButtons.tsx   # Download and clear buttons
│   │   └── Instructions.tsx    # Usage instructions
│   ├── utils/
│   │   └── conversion.ts       # Conversion logic and mapping
│   ├── az-cyrillic-latin.tsx   # Main converter component
│   ├── layout.tsx              # App layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── public/
│   └── icon.png                # App icon
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crylic-to-latin
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Type or paste Azerbaijani text in Cyrillic script in the left textarea or Click "Upload File" to select a TXT, PDF, DOC, or DOCX file
2. The Latin script conversion appears instantly in the right textarea
3. Use the "Download TXT" button to save the converted text

## Conversion Mapping

The app uses the official Azerbaijani Cyrillic to Latin conversion mapping, including special characters like:
- Ә/ә → Ə/ə
- Ғ/ғ → Ğ/ğ
- И/и → İ/i
- Ҝ/ҝ → G/g
- Ү/ү → Ü/ü
- And more...