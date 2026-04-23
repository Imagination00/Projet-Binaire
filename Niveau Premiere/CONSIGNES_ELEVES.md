# Version eleves - Convertisseur de bases (HTML + Brython)

## Objectif

Completer le code pour obtenir un convertisseur de bases fonctionnel (2, 8, 10, 16)
dans une seule page HTML, sans Flask.

## Fichier unique a utiliser

- `index.html` : contient la structure HTML et la logique (Python Brython).
- `styles.css` : contient la mise en forme CSS.

## Travail demande

1. Completer les TODO HTML dans la page.
2. Completer les TODO Python (PY 1 a PY 4) dans le script Brython.
3. Verifier que la conversion fonctionne pour plusieurs bases.

## Tests conseilles

- `1011` base 2 -> base 10 = `11`
- `2F` base 16 -> base 10 = `47`
- `47` base 10 -> base 2 = `101111`
- `77` base 8 -> base 16 = `3F`

## Lancer le projet

1. Ouvrir `index.html` dans un navigateur avec connexion internet (chargement CDN Brython).
2. Tester les conversions depuis l'interface.

## Important

Ne pas utiliser `app.py`, `templates/` ni `static/` pour cette version.
La version demandee est uniquement la page `index.html`.

Les fichiers Flask historiques peuvent etre supprimes du dossier.
