# Version eleves - Convertisseur de bases

## Objectif
Completer le code pour obtenir un convertisseur de bases fonctionnel (2, 8, 10, 16).

## Fichiers utiles
- `static/script.js` : logique a completer (TODO 1 a TODO 4)
- `templates/index.html` : interface deja fournie
- `app.py` : serveur Flask deja pret

## Travail demande
1. Completer `obtenirValeurChiffre`.
2. Completer `nombreValidePourBase` avec les bons motifs regex.
3. Completer `lireNombreAvecPuissances`.
4. Completer la boucle de `calculerDivisionsSuccessives`.

## Tests conseilles
- `1011` base 2 -> base 10 = `11`
- `2F` base 16 -> base 10 = `47`
- `47` base 10 -> base 2 = `101111`
- `77` base 8 -> base 16 = `3F`

## Lancer le projet
```bash
pip install -r requirements.txt
python app.py
```
Puis ouvrir l'URL affichee dans le terminal.
