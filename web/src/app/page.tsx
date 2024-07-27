import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen p-8 flex flex-col justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <h1 className="text-5xl font-bold text-pink-500">PowLang</h1>
        <nav>
          <Link href="/compiler">
            <p className="text-lg text-blue-400 hover:underline">Compiler</p>
          </Link>
        </nav>
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

        <section className="mb-16">
          <h3 className="text-3xl text-blue-400 mb-6">Installation</h3>
          <p className="text-lg mb-4">
            Pour installer PowLang, suivez les étapes suivantes :
          </p>
          <pre className="w-full bg-gray-800 p-6 rounded-lg shadow-lg text-left">
            <code className="block whitespace-pre-wrap text-sm">
              {`1. Clonez le dépôt:
    git clone https://github.com/votre-utilisateur/powlang-compiler.git
    cd powlang-compiler

2. Installez les dépendances pour le compilateur:
    npm install

3. Accédez au dossier web et installez les dépendances pour l'interface web:
    cd web
    npm install

4. Lancez l'application web:
    npm run dev

Pour exécuter le compilateur avec un fichier PowLang, utilisez la commande suivante:
    npm run dev

Ouvrez votre navigateur et allez à l'adresse:
    http://localhost:3000`}
            </code>
          </pre>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl text-blue-400 mb-6">
            Exemple de Code PowLang
          </h3>
          <pre className="w-full bg-gray-800 p-6 rounded-lg shadow-lg text-left">
            <code className="block whitespace-pre-wrap text-sm">
              {`# Définir une variable nombre x
define number x = 5

# Afficher le résultat de x + 3
show(x + 3)      # Devrait afficher 8

# Afficher le résultat de x > 2
show(x > 2)      # Devrait afficher true

# Afficher le résultat de x =e 5 (x est égal à 5)
show(x =e 5)     # Devrait afficher true

# Afficher le résultat de x =e 3 (x n'est pas égal à 3)
show(x =e 3)     # Devrait afficher false

# Afficher le résultat de x =s 5 (x est égal à 5)
show(x =s 5)     # Devrait afficher true

# Afficher le résultat de x =s 3 (x est supérieur ou égal à 3)
show(x =s 3)     # Devrait afficher true

# Afficher le résultat de x =i 5 (x est inférieur ou égal à 5)
show(x =i 5)     # Devrait afficher true

# Afficher le résultat de x =i 6 (x est inférieur ou égal à 6)
show(x =i 6)     # Devrait afficher true

# Afficher le résultat de x =i 3 (x n'est pas inférieur ou égal à 3)
show(x =i 3)     # Devrait afficher false

# Définir une chaîne y
define string y = "hello"

# Afficher la chaîne y
show(y)          # Devrait afficher hello

# Afficher le résultat de y =e "hello"
show(y =e "hello") # Devrait afficher true

# Afficher le résultat de y =e "world"
show(y =e "world") # Devrait afficher false`}
            </code>
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
        <p className="text-lg">© 2024 PowLang. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
