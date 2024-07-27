"use client";

import { useState } from "react";
import axios from "axios";
import powLangGrammar from "../powlang-grammar";
import powLangStyle from "../powlang-style";

function applySyntaxHighlighting(code: string) {
  const tokens: { type: string; value: string; index: number }[] = [];
  const regex = new RegExp(
    Object.keys(powLangGrammar)
      .map((key) => `(?<${key}>${powLangGrammar[key].source})`)
      .join("|"),
    "g"
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
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [time, setTime] = useState("");

  const handleCompile = async () => {
    try {
      const response = await axios.post("/api/compiler", { code });
      setOutput(response.data.output);
      setTime(response.data.time);
    } catch (error: any) {
      setOutput(
        error.response ? error.response.data.error : "An error occurred"
      );
    }
  };

  const handleKeywordClick = (value: string, key: number) => {
    return key === 0
      ? setCode((prevCode) => `${prevCode}${value}`)
      : setCode((prevCode) => `${prevCode}\n\n${value}`);
  };

  const handleTestFunCode = () => {
    const funCode = `# Définir les variables pour le nombre de chats et de chiens
define number cats as 3
define number dogs as 4

# Afficher les valeurs initiales
show("Initialement, nous avons", cats, "chats et", dogs, "chiens.")

# Effectuer des opérations arithmétiques pour augmenter le nombre d'animaux
define number newCats as cats + 2
define number newDogs as dogs * 2

# Afficher les nouveaux nombres d'animaux
show("Après quelques mois, nous avons", newCats, "chats et", newDogs, "chiens.")

# Comparer les nombres de chats et de chiens
show("Avons-nous plus de chiens que de chats ?", newDogs > newCats)
show("Avons-nous moins de chats que de chiens ?", newCats < newDogs)
show("Avons-nous exactement 5 chats maintenant ?", newCats =e 5)

# Boucle pour simuler l'adoption de nouveaux chats
show("Les chats sont adoptés un par un jusqu'à ce qu'il n'en reste plus.")
when newCats > 0 :: newCats-- => {
    show("Il reste", newCats, "chats.")
}

show("Tous les chats ont été adoptés !")`;

    setCode(funCode);
  };

  const keywordDictionary = {
    define: {
      description: "Defines a new variable.",
      usage: "define type variable as value",
      value: `define number x as 0`,
    },
    show: {
      description: "Outputs the value to the console.",
      usage: "show(value)",
      value: `show("Value for x:", x)`,
    },
    when: {
      description: "Defines a loop.",
      usage: "when condition :: increment => { body }",
      value: `when x < 5 :: x++ => { \n  show(x)\n}`,
    },
  };

  return (
    <div className="container">
      <main>
        <div className="flex justify-center items-center gap-8">
          <h1 className="title">PowLang Compiler</h1>
          <img src="/powlang.png" className="h-24 w-24" alt="PowLang Logo"></img>
        </div>
        <textarea
          className="outline-0"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your PowLang code here..."
          rows={10}
          cols={50}
        />
        <div className="flex gap-4">
          <button onClick={handleCompile} disabled={code.length <= 0} className="disabled:opacity-50 disabled:cursor-not-allowed">Compile</button>
          <button onClick={handleTestFunCode}>Tester un code rigolo</button>
        </div>
        <h2>Compilation time</h2>
        <pre>{time}</pre>
        <h2>Output</h2>
        <pre>{output}</pre>
        <h2>Code</h2>
        <pre
          className="language-powlang"
          style={powLangStyle['pre[class*="language-"]']}
        >
          {applySyntaxHighlighting(code)}
        </pre>
        <h2>Keyword Dictionary</h2>
        <ul className="dictionary">
          {Object.entries(keywordDictionary).map(
            ([keyword, { description, value, usage }], key) => (
              <li key={keyword} onClick={() => handleKeywordClick(value, key)}>
                <strong>{keyword}:</strong> {description}
                <pre
                  className="my-4"
                  style={powLangStyle['pre[class*="language-"]']}
                >
                  {applySyntaxHighlighting(usage)}
                </pre>
              </li>
            )
          )}
        </ul>
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
          max-width: 800px;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #ff79c6;
          text-align: center;
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
          text-align: center;
        }

        pre {
          width: 100%;
          white-space: pre-wrap;
          word-wrap: break-word;
          padding: 1em;
          background: #2d2d2d;
          border: 1px solid #444;
          border-radius: 5px;
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 200px;
        }

        .dictionary {
          list-style: none;
          padding: 0;
          margin-top: 20px;
          width: 100%;
        }

        .dictionary li {
          margin-bottom: 10px;
          cursor: pointer;
          transition: color 0.3s;
          padding: 10px;
          background: #2d2d2d;
          border: 1px solid #444;
          border-radius: 5px;
        }

        .dictionary li:hover {
          color: #50fa7b;
        }

        .dictionary strong {
          color: #50fa7b;
        }

        .dictionary pre {
          background: #2d2d2d;
          border: none;
          color: #f8f8f2;
          padding: 0;
          margin: 0;
        }

        .flex {
          display: flex;
        }

        .gap-4 {
          gap: 1rem;
        }

        .gap-8 {
          gap: 2rem;
        }

        .justify-center {
          justify-content: center;
        }

        .items-center {
          align-items: center;
        }

        .disabled:opacity-50 {
          opacity: 0.5;
        }

        .disabled:cursor-not-allowed {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
