from browser import document, html


champ_nombre = document["numberInput"]
base_depart_select = document["fromBase"]
base_arrivee_select = document["toBase"]
mode_select = document["method"]
bouton_convertir = document["convertBtn"]
zone_resultat = document["result"]
zone_message = document["feedback"]
liste_etapes = document["steps"]
bloc_etapes = document["stepsBox"]
bloc_arbre = document["divisionBox"]
zone_arbre = document["divisionDetails"]
zone_aide_arbre = document["treeHelp"]


CHIFFRES = "0123456789ABCDEF"


def chiffre_vers_valeur(caractere):
    """
    Transforme un chiffre écrit ('0' à 'F') en valeur numérique.

    Paramètres:
        caractere (str): Un caractère représentant un chiffre hexadécimal ('0' à 'F', majuscule ou minuscule).

    Retourne:
        int: La valeur numérique du caractère (0 à 15), ou -1 si le caractère n'est pas un chiffre valide.
    """
    return CHIFFRES.find(caractere.upper())


def valeur_vers_chiffre(valeur):
    """
    Transforme une valeur numérique (entre 0 et 15)
    en son chiffre correspondant.

    Paramètres:
        valeur (int): Une valeur numérique entre 0 et 15.

    Retourne:
        str: Le caractère correspondant à la valeur dans la chaîne CHIFFRES.
    """
    return CHIFFRES[valeur]


def nombre_est_valide(valeur, base):
    """
    Vérifie qu'un nombre écrit ne contient que des chiffres
    autorisés dans la base donnée.

    Paramètres:
        valeur (str): La chaîne de caractères représentant le nombre à vérifier.
        base (int): La base dans laquelle le nombre doit être valide (2 à 16).

    Retourne:
        bool: True si tous les caractères sont valides pour la base donnée, False sinon.
    """
    for caractere in valeur.upper():
        v = chiffre_vers_valeur(caractere)
        if v < 0 or v >= base:
            return False
    return True


def convertir_vers_decimal(valeur, base):
    """
    Convertit un nombre écrit dans une base donnée en un entier en base 10
    en utilisant la décomposition en puissances de la base.

    Paramètres :
    - valeur (str) : nombre à convertir.
    - base (int) : base du nombre (entre 2 et 16).

    Retour :
    - int : valeur du nombre en base 10.
    """
    if valeur == 0:
        return "0"

    resultat = 0
    chiffres = valeur.upper()
    puissance = len(chiffres) - 1

    for chiffre in chiffres:
        resultat += chiffre_vers_valeur(chiffre) * (base ** puissance)
        puissance -= 1

    return resultat


def decimal_vers_base(valeur, base):
    """
    Convertit un entier en base 10 vers une autre base
    en utilisant la méthode des divisions successives.

    Paramètres :
    - valeur (int) : nombre en base 10 à convertir.
    - base (int) : base d'arrivée (entre 2 et 16).

    Retour :
    - str : écriture du nombre dans la base demandée.
    """
    if valeur == 0:
        return "0"
    
    resultat = ""

    while valeur != 0:
        reste = valeur % base
        chiffre = valeur_vers_chiffre(reste)
        resultat = chiffre + resultat
        valeur = valeur // base

    return resultat


def expliquer_conversion_positionnelle(valeur, base):
    """
    Génère une explication textuelle de la conversion
    d'un nombre vers le décimal par décomposition positionnelle.

    Paramètres :
    - valeur (str) : nombre à convertir.
    - base (int) : base du nombre.

    Retour :
    - list[str] : phrases expliquant le calcul.
    """
    termes = []
    chiffres = valeur.upper()

    for i, chiffre in enumerate(chiffres):
        puissance = len(chiffres) - 1 - i
        v = chiffre_vers_valeur(chiffre)
        termes.append(f"{v} × {base}^{puissance}")

    decimal = convertir_vers_decimal(valeur, base)

    return [
        f"On écrit {valeur} comme une somme de puissances de {base}.",
        " + ".join(termes) + f" = {decimal}"
    ]


def expliquer_divisions(valeur, base):
    """
    Explique la méthode des divisions successives appliquée
    à un entier en base 10.

    Paramètres :
    - valeur (int) : nombre en base 10.
    - base (int) : base d'arrivée.

    Retour :
    - list[str] : phrases expliquant chaque étape.
    """
    if valeur == 0:
        return ["0 reste 0 dans toutes les bases."]

    etapes = []
    courant = valeur

    while courant != 0:
        quotient = courant // base
        reste = courant % base
        etapes.append(
            f"{courant} = {quotient} × {base} + {valeur_vers_chiffre(reste)}"
        )
        courant = quotient

    etapes.append("On lit les restes de bas en haut pour obtenir le résultat.")

    return etapes


def afficher_etapes(etapes):
    """
    Affiche une liste d'étapes textuelles dans la zone prévue.

    Paramètres :
    - etapes (list[str]) : liste de phrases expliquant le calcul.

    Retour :
    - None
    """
    liste_etapes.clear()
    for etape in etapes:
        liste_etapes <= html.LI(etape)


def construire_divisions_arbre(valeur, base):
    """
    Construit les données nécessaires à l'affichage de l'arbre
    des divisions successives.

    Paramètres :
    - valeur (int) : nombre en base 10.
    - base (int) : base d'arrivée.

    Retour :
    - dict :
        {
            "divisions": list[dict],
            "restes": list[int]
        }
    """

    if valeur == 0:
        return {
            "divisions": [{
                "courant": 0,
                "quotient": 0,
                "reste": 0
            }],
            "restes": [0]
        }

    divisions = []
    restes = []

    courant = valeur

    while courant != 0:
        quotient = courant // base
        reste = courant % base

        divisions.append({
            "courant": courant,
            "quotient": quotient,
            "reste": reste
        })

        restes.append(reste)
        courant = quotient

    return {
        "divisions": divisions,
        "restes": restes
    }


def construire_arbre_html(divisions, base, valeur_finale):
    """
    Génère le code HTML représentant l'arbre des divisions successives.

    Cette fonction transforme les données issues de la conversion
    en une structure visuelle lisible sous forme d'arbre :
    divisions à gauche et restes à droite.

    Paramètres :
    - divisions (list[dict]) : étapes de divisions successives.
    - base (int) : base cible de conversion.
    - valeur_finale (int) : valeur initiale en base 10.

    Retour :
    - str : chaîne HTML représentant l'arbre de conversion.
    """
    lignes = ""
    restes = []

    for d in divisions:
        reste_char = valeur_vers_chiffre(d["reste"])
        restes.append(reste_char)

        lignes += (
            '<div class="tree-row">'
            f'<div class="tree-current">{d["courant"]}</div>'
            f'<div class="tree-divider">÷ {base} =</div>'
            f'<div class="tree-quotient">{d["quotient"]}</div>'
            '</div>'
        )

    restes_inverse = list(reversed(restes))

    return (
        f'<div class="tree-meta">Conversion de {valeur_finale} en base {base}</div>'
        '<div class="tree-layout">'
        '<div class="tree-left">'
        f'{lignes}'
        '</div>'
        '<div class="tree-right">'
        '<div class="tree-label">Reste</div>'
        + "".join(f'<div class="tree-remainder">{r}</div>' for r in restes)
        + '</div>'
        '</div>'
        '<div class="tree-footer">'
        f"On lit les restes de bas en haut : {' / '.join(restes_inverse)}."
        '</div>'
    )


def convertir_nombre(_event=None):
    """
    Fonction principale appelée par l'interface.
    Elle lit les entrées, effectue les conversions
    et affiche le résultat et les explications.

    Paramètres :
    - _event : événement clavier ou clic (ignoré).

    Retour :
    - None
    """
    valeur = champ_nombre.value.strip()
    base_depart = int(base_depart_select.value)
    base_arrivee = int(base_arrivee_select.value)
    mode = mode_select.value

    zone_message.text = ""
    zone_resultat.text = "-"
    afficher_etapes(["Aucune étape pour le moment."])

    bloc_arbre.hidden = True
    zone_arbre.html = ""
    zone_aide_arbre.text = ""

    if not valeur:
        zone_message.text = "Veuillez saisir un nombre."
        return

    if not nombre_est_valide(valeur, base_depart):
        zone_message.text = "Le nombre ne correspond pas à la base choisie."
        return

    decimal = convertir_vers_decimal(valeur, base_depart)
    resultat = decimal_vers_base(decimal, base_arrivee)
    zone_resultat.text = resultat

    # MODE ARBRE
    if mode == "tree":
        if base_arrivee == 10:
            zone_message.text = "Le mode arbre s'applique uniquement à une conversion vers une base ≠ 10."
            return

        data = construire_divisions_arbre(decimal, base_arrivee)
        arbre_html = construire_arbre_html(
            data["divisions"],
            base_arrivee,
            decimal
        )

        afficher_etapes([])

        zone_arbre.html = arbre_html
        bloc_arbre.hidden = False
        return

    # MODE CLASSIQUE
    etapes = []

    if base_depart != 10:
        etapes += expliquer_conversion_positionnelle(valeur, base_depart)

    if base_arrivee != 10:
        etapes.append(
            f"On convertit {decimal} en base {base_arrivee} par divisions successives."
        )
        etapes += expliquer_divisions(decimal, base_arrivee)

    afficher_etapes(etapes)


bouton_convertir.bind("click", convertir_nombre)
champ_nombre.bind("keydown", lambda event: convertir_nombre(event) if event.key == "Enter" else None)
