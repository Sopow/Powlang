# PowLang Compiler

PowLang est un langage de programmation simple conçu pour illustrer les concepts de base des compilateurs. Ce projet inclut un compilateur écrit en JavaScript et une interface web en Next.js pour écrire, compiler et exécuter du code PowLang.

## Fonctionnalités

- Déclaration de variables de type nombre et chaîne de caractères
- Affichage des expressions et des résultats
- Opérateurs de comparaison et arithmétiques
- Boucles `when`
- Prise en charge des commentaires
- Conditions avec opérateurs tertiaires et if else

## Installation

1. Clonez le dépôt:
    ```sh
    git clone https://github.com/Sopow/powlang.git
    cd powlang
    ```

2. Installez les dépendances pour le compilateur:
    ```sh
    npm install
    ```

3. Accédez au dossier `web` et installez les dépendances pour l'interface web:
    ```sh
    cd web
    npm install
    ```

4. Lancez l'application web:
    ```sh
    npm run dev
    ```

### Exécution du Compilateur

Pour exécuter le compilateur avec un fichier PowLang, utilisez la commande suivante:
```sh
node compiler/compiler.js example.pow
```

### Interface Web

1. Ouvrez votre navigateur et allez à l'adresse:
    ```
    http://localhost:3000
    ```

2. Entrez votre code PowLang dans l'éditeur de texte et cliquez sur "Compile" pour voir le résultat et la sortie.

### Exemple de Code PowLang

Voici un exemple de fichier `example.pow` qui illustre les fonctionnalités du langage:

```plaintext
# Define a number x
define number x as 5

# Show the result of x + 3
show(x + 3)      # Should print 8

# Show the result of x > 2
show(x > 2)      # Should print true

# Show the result of x =e 5 (x is equal to 5)
show(x =e 5)     # Should print true

# Show the result of x =e 3 (x is not equal to 3)
show(x =e 3)     # Should print false

# Show the result of x =s 5 (x is equal to 5)
show(x =s 5)     # Should print true

# Show the result of x =s 3 (x is greater than or equal to 3)
show(x =s 3)     # Should print true

# Show the result of x =i 5 (x is less than or equal to 5)
show(x =i 5)     # Should print true

# Show the result of x =i 6 (x is less than or equal to 6)
show(x =i 6)     # Should print true

# Show the result of x =i 3 (x is not less than or equal to 3)
show(x =i 3)     # Should print false

# Define a string y
define string y as "hello"

# Show the string y
show(y)          # Should print hello

# Show the result of y =e "hello"
show(y =e "hello") # Should print true

# Show the result of y =e "world"
show(y =e "world") # Should print false

# Define another number z
define number z as 10

# Use a loop to decrement x until it is less than or equal to 0
when x > 0 :: x-- => {
    show(x)
}
```

## Contribution

Les contributions sont les bienvenues ! Pour contribuer, veuillez créer une branche, ajouter vos modifications et soumettre une pull request.

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.