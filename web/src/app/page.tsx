'use client';

import { useState } from 'react';
import axios from 'axios';
import powLangGrammar from '../powlang-grammar';
import powLangStyle from '../powlang-style';

function applySyntaxHighlighting(code: string) {
  const tokens: { type: string; value: string; index: number }[] = [];
  const regex = new RegExp(
    Object.keys(powLangGrammar)
      .map((key) => `(?<${key}>${powLangGrammar[key].source})`)
      .join('|'),
    'g'
  );

  let match: any;
  while ((match = regex.exec(code)) !== null) {
    const { index } = match;
    const tokenType = Object.keys(powLangGrammar).find(
      (key) => match.groups?.[key] !== undefined
    );
    if (tokenType) {
      tokens.push({
        type: tokenType,
        value: match[0],
        index,
      });
    }
  }

  const highlightedCode = [];
  let lastIndex = 0;
  tokens.forEach(({ type, value, index }) => {
    if (index > lastIndex) {
      highlightedCode.push(code.slice(lastIndex, index));
    }
    highlightedCode.push(
      <span key={index} style={powLangStyle[type]}>
        {value}
      </span>
    );
    lastIndex = index + value.length;
  });

  if (lastIndex < code.length) {
    highlightedCode.push(code.slice(lastIndex));
  }

  return highlightedCode;
}

export default function Home() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleCompile = async () => {
    try {
      const response = await axios.post('/api/compiler', { code });
      setOutput(response.data.output);
    } catch (error: any) {
      setOutput(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div className="container">
      <main>
        <h1 className="title">PowLang Compiler</h1>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your PowLang code here..."
          rows={10}
          cols={50}
        />
        <button onClick={handleCompile}>Compile</button>
        <h2>Output</h2>
        <pre>{output}</pre>
        <h2>Code</h2>
        <pre className="language-powlang" style={powLangStyle['pre[class*="language-"]']}>
          {applySyntaxHighlighting(code)}
        </pre>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          min-width: 100vw;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #1e1e1e;
          color: #f8f8f2;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        h1 {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: #ff79c6;
        }

        textarea {
          width: 100%;
          height: 200px;
          margin: 20px 0;
          padding: 10px;
          font-family: monospace;
          font-size: 1.2em;
          border: 1px solid #444;
          border-radius: 5px;
          background: #2d2d2d;
          color: #f8f8f2;
          resize: none;
        }

        button {
          padding: 10px 20px;
          font-size: 1em;
          cursor: pointer;
          margin-bottom: 20px;
          border: none;
          border-radius: 5px;
          background: #ff79c6;
          color: #f8f8f2;
          transition: background 0.3s ease;
        }

        button:hover {
          background: #ff92d6;
        }

        h2 {
          margin-top: 20px;
          color: #8be9fd;
        }

        pre {
          width: 100%;
          white-space: pre-wrap;
          word-wrap: break-word;
          padding: 1em;
          background: #2d2d2d;
          border: 1px solid #444;
          border-radius: 5px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}