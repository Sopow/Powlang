"use client";
import Link from "next/link";
import powLangStyle from "@/powlang-style";
import powLangGrammar from "@/powlang-grammar";

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

export default function HomePage() {
  return (
    <div className="min-h-screen p-8 flex flex-col justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <h1 className="text-5xl font-bold text-pink-500">PowLang</h1>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center text-center">
        <section className="mb-16">
          <h2 className="text-4xl text-blue-400 mb-6">
            Bienvenue dans PowLang
          </h2>
          <p className="text-xl mb-6">
            PowLang est un langage de programmation simple conçu pour illustrer
            les concepts de base des compilateurs. Ce projet inclut un
            compilateur écrit en JavaScript et une interface web en Next.js pour
            écrire, compiler et exécuter du code PowLang.
          </p>
          <img
            src="/powlang.png"
            className="h-48 w-48 mx-auto mb-6"
            alt="PowLang Logo"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-md mx-auto">
            <Link href="/compiler">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Accéder au compilateur
              </button>
            </Link>
            <a
              href="https://github.com/Sopow/powlang"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                Accéder au code sur Github
              </button>
            </a>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl text-blue-400 mb-6">Fonctionnalités</h3>
          <ul className="list-disc pl-5 text-left">
            <li className="mb-2">
              Déclaration de variables de type nombre et chaîne de caractères
            </li>
            <li className="mb-2">Affichage des expressions et des résultats</li>
            <li className="mb-2">Opérateurs de comparaison et arithmétiques</li>
            <li className="mb-2">Prise en charge des commentaires</li>
          </ul>
        </section>

        <section className="mb-16 w-full">
          <h3 className="text-3xl text-blue-400 mb-6">Installation</h3>
          <p className="text-lg mb-4">
            Pour installer PowLang, suivez les étapes suivantes :
          </p>
          <pre className="w-full bg-gray-800 p-6 rounded-lg shadow-lg text-left">
            <code className="block whitespace-pre-wrap text-sm">
              {`1. Clonez le dépôt:
    git clone https://github.com/Sopow/powland.git

2. Installez les dépendances pour le compilateur:
    npm install

3. Accédez au dossier web et installez les dépendances pour l'interface web:
    cd web
    npm install

4. Lancez l'application web:
    npm run dev

Pour exécuter le compilateur avec un fichier PowLang, utilisez la commande suivante dans le directory root:
    npm run dev

Ouvrez votre navigateur et allez à l'adresse:
    http://localhost:3000`}
            </code>
          </pre>
        </section>

        <section className="mb-16 w-full">
          <h3 className="text-3xl text-blue-400 mb-6">
            Exemple de Code PowLang
          </h3>
          <pre className="w-full bg-gray-800 p-6 rounded-lg shadow-lg text-left">
            <pre
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded overflow-auto"
              style={powLangStyle['pre[class*="language-"]']}
            >
              {applySyntaxHighlighting(`# Exemples de tests pour les fonctionnalités de powlang
# Définir des variables de différents types de nombres
define number a as -5
define number b as 10.5
define number c as 2.2e3 # 2200 en notation scientifique
define number d as -3.5e-2 # -0.035 en notation scientifique

# Afficher les valeurs initiales
show("Initial values:", a, b, c, d)

# Calculer des sommes et des produits
define number sum as a + b + c + d
show("Sum:", sum)

define number product as a * b * c * d
show("Product:", product)

# Utiliser une condition ternaire pour déterminer la valeur maximale
define number max as (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c)
show("Max value:", max)

# Utiliser une condition ternaire pour déterminer la valeur minimale
define number min as (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c)
show("Min value:", min)

# Vérifier des conditions avec ala et otw
show("Checking conditions:")

ala a + b > c -> {
  show("a + b is greater than c")
} otw -> {
  show("a + b is not greater than c")
}

ala a * b > c * c -> {
  show("a * b is greater than c squared")
} otw -> {
  show("a * b is not greater than c squared")
}

# Incrémenter un compteur avec une boucle when
define number counter as 0
show("Initial counter value:", counter)

show("Incrementing counter to five:")
when counter < 5 :: counter++ => {
  show("Counter value:", counter)
}
show("Counter has reached five")

# Calculer la factorielle d'un nombre
define number factorial as 1
define number numberToFactorial as 5
define number i as 1

show("Calculating factorial of", numberToFactorial)

when i =i numberToFactorial :: i++ => {
  factorial = factorial * i
  show("Current factorial value:", factorial)
}

show("Factorial of", numberToFactorial, "is", factorial)
`)}
            </pre>
          </pre>
        </section>

        <section>
          <h3 className="text-3xl text-blue-400 mb-6">Contributions</h3>
          <p className="text-lg">
            Les contributions sont les bienvenues ! Pour contribuer, veuillez
            créer une branche, ajouter vos modifications et soumettre une pull
            request.
          </p>
        </section>
      </main>

      <footer className="mt-12">
        <p className="text-lg">
          © {new Date().getFullYear()} PowLang. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
