"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import powLangGrammar from "@/powlang-grammar";
import powLangStyle from "@/powlang-style";

function applySyntaxHighlighting(code: string | any) {
  const tokens = [];
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
  const [enableLogs, setEnableLogs] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCompiling) {
      interval = setInterval(() => {
        setSpinnerFrame((prevFrame) => (prevFrame + 1) % spinnerFrames.length);
      }, 100);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCompiling]);

  const handleCompile = async () => {
    setIsCompiling(true);
    setOutput("");
    setTime("");

    try {
      const response = await axios.post("/api/compiler", { code, enableLogs });

      if (response.status === 202) {
        setOutput(response.data.output);
      } else {
        setOutput(response.data.output);
        setTime(response.data.time);
      }
    } catch (error: any) {
      setOutput(
        error.response ? error.response.data.error : "An error occurred"
      );
    } finally {
      setIsCompiling(false);
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
    <div className="min-h-screen min-w-screen p-4 flex flex-col justify-center items-center bg-gray-900 text-gray-100">
      <main className="p-6 flex flex-col justify-center items-center w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          <h1 className="text-4xl mb-4 text-pink-400 text-center">PowLang Compiler</h1>
          <img src="/powlang.png" className="h-24 w-24" alt="PowLang Logo"></img>
        </div>
        <textarea
          className="w-full h-48 my-5 p-2 font-mono text-lg sm:text-xl border border-gray-700 rounded bg-gray-800 text-gray-100 outline-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your PowLang code here..."
        />
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={handleCompile}
            disabled={code.length <= 0}
            className="py-2 px-4 bg-pink-400 text-gray-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compile
          </button>
          <button
            onClick={handleTestFunCode}
            className="py-2 px-4 bg-blue-500 text-gray-900 rounded"
          >
            Tester un code rigolo
          </button>
        </div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={enableLogs}
            onChange={(e) => setEnableLogs(e.target.checked)}
            className="mr-2"
          />
          <span>Afficher les logs supplémentaires</span><span className="font-bold ml-1">(AVANCÉ)</span>
        </label>
        <h2 className="text-2xl text-blue-400 mb-2">Compilation time</h2>
        <pre className="w-full p-2 bg-gray-800 border border-gray-700 rounded mb-4 overflow-auto">{time}</pre>
        <h2 className="text-2xl text-blue-400 mb-2">Output</h2>
        <pre className="w-full p-2 bg-gray-800 border border-gray-700 rounded mb-4 overflow-auto">{output}</pre>
        <h2 className="text-2xl text-blue-400 mb-2">Code</h2>
        <pre
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded overflow-auto"
          style={powLangStyle['pre[class*="language-"]']}
        >
          {applySyntaxHighlighting(code)}
        </pre>
        <h2 className="text-2xl text-blue-400 mb-2">Keyword Dictionary</h2>
        <ul className="flex flex-wrap list-none p-0 mt-4 w-full">
          {Object.entries(keywordDictionary).map(
            ([keyword, { description, value, usage }], key) => (
              <li
                key={keyword}
                onClick={() => handleKeywordClick(value, key)}
                className="w-full p-2 mb-4 cursor-pointer transition-colors bg-gray-800 border border-gray-700 rounded hover:text-green-400"
              >
                <strong className="text-green-400">{keyword}:</strong> {description}
                <pre
                  className="my-4 bg-gray-800 w-full border-none text-[3vw] md:text-lg text-gray-100 p-0 m-0"
                  style={powLangStyle['pre[class*="language-"]']}
                >
                  {applySyntaxHighlighting(usage)}
                </pre>
              </li>
            )
          )}
        </ul>
      </main>
    </div>
  );
}
