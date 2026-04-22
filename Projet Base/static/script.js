const champNombre = document.getElementById("numberInput");
const baseDepartSelect = document.getElementById("fromBase");
const baseArriveeSelect = document.getElementById("toBase");
const modeSelect = document.getElementById("method");
const boutonConvertir = document.getElementById("convertBtn");
const zoneResultat = document.getElementById("result");
const zoneMessage = document.getElementById("feedback");
const listeEtapes = document.getElementById("steps");
const blocEtapes = listeEtapes.closest(".steps-box");
const blocArbre = document.getElementById("divisionBox");
const zoneArbre = document.getElementById("divisionDetails");

const CHIFFRES = "0123456789ABCDEF";

/**
 * Convertit un caractère en valeur numérique pour lire les bases 2, 8, 10 et 16.
 * @param {string} caractere - Chiffre saisi par l'utilisateur.
 * @returns {number} Position du caractère dans la chaîne CHIFFRES.
 */
function obtenirValeurChiffre(caractere) {
  return CHIFFRES.indexOf(caractere.toUpperCase());
}

/**
 * Convertit une valeur numérique en chiffre de sortie.
 * @param {number} valeur - Valeur à écrire dans la base cible.
 * @returns {string} Chiffre correspondant.
 */
function obtenirChiffre(valeur) {
  return CHIFFRES[valeur];
}

/**
 * Vérifie qu'une saisie est correcte pour la base choisie.
 * @param {string} valeur - Nombre saisi dans le champ texte.
 * @param {number} base - Base de départ choisie.
 * @returns {boolean} Vrai si la saisie respecte la base.
 */
function nombreValidePourBase(valeur, base) {
  const motifs = {
    2: /^[01]+$/i,
    8: /^[0-7]+$/i,
    10: /^[0-9]+$/i,
    16: /^[0-9a-f]+$/i
  };

  return motifs[base].test(valeur);
}

/**
 * Met à jour la liste d'étapes affichée sous le résultat.
 * @param {string[]} etapes - Texte des étapes à afficher.
 */
function afficherEtapes(etapes) {
  listeEtapes.innerHTML = etapes.map((etape) => `<li>${etape}</li>`).join("");
  if (blocEtapes) {
    blocEtapes.hidden = etapes.length === 0;
  }
}

/**
 * Affiche ou masque le bloc contenant l'arbre du calcul.
 * @param {string} contenu - Code HTML du bloc arbre. Vide si on cache le bloc.
 */
function afficherArbre(contenu) {
  zoneArbre.innerHTML = contenu;
  blocArbre.hidden = !contenu;
}

/**
 * Décompose un nombre écrit dans une base sous forme de somme de puissances.
 * Cette étape montre aux élèves comment on lit la valeur d'un nombre positionnel.
 * @param {string} valeurSource - Nombre saisi.
 * @param {number} baseSource - Base de départ.
 * @returns {{valeurDecimale: number, etapes: string[]}}
 */
function lireNombreAvecPuissances(valeurSource, baseSource) {
  const chiffres = valeurSource.toUpperCase().split("");

  const termes = chiffres.map((chiffre, index) => {
    const puissance = chiffres.length - 1 - index;
    const valeurChiffre = obtenirValeurChiffre(chiffre);

    return {
      chiffre,
      valeurChiffre,
      puissance,
      terme: `${valeurChiffre} x ${baseSource}<sup>${puissance}</sup>`
    };
  });

  const valeurDecimale = termes.reduce(
    (somme, terme) => somme + terme.valeurChiffre * Math.pow(baseSource, terme.puissance),
    0
  );

  const expression = termes.map((terme) => terme.terme).join(" + ");

  return {
    valeurDecimale,
    etapes: [
      `On écrit ${valeurSource} comme une somme de chiffres pondérés par des puissances de ${baseSource}.`,
      `${expression} = ${valeurDecimale}`
    ]
  };
}

/**
 * Effectue les divisions successives et prépare le résultat + les étapes détaillées.
 * C'est la méthode classique utilisée pour écrire un entier en base cible.
 * @param {number} valeurDecimale - Valeur en base 10.
 * @param {number} baseCible - Base d'arrivée.
 * @returns {{resultat: string, etapes: string[], arbre: string}}
 */
function calculerDivisionsSuccessives(valeurDecimale, baseCible) {
  if (valeurDecimale === 0) {
    return {
      resultat: "0",
      etapes: ["0 reste 0 dans toutes les bases."],
      arbre: construireArbreDivisions(valeurDecimale, baseCible, [{ courant: 0, quotient: 0, reste: 0 }])
    };
  }

  const divisions = [];
  let courant = valeurDecimale;

  while (courant > 0) {
    const quotient = Math.floor(courant / baseCible);
    const reste = courant % baseCible;
    divisions.push({ courant, quotient, reste });
    courant = quotient;
  }

  const restes = divisions.map((division) => obtenirChiffre(division.reste));
  const resultat = restes.slice().reverse().join("");
  const resteInverse = restes.slice().reverse();

  const etapes = divisions.map(
    (division) => `${division.courant} = ${division.quotient} x ${baseCible} + ${obtenirChiffre(division.reste)}`
  );

  etapes.push(`On lit les restes de bas en haut : ${resteInverse.join(" / ")}.`);
  etapes.push(`Écriture finale en base ${baseCible} : ${resultat}.`);

  return {
    resultat,
    etapes,
    arbre: construireArbreDivisions(valeurDecimale, baseCible, divisions)
  };
}

/**
 * Construit un affichage visuel simple de l'arbre des divisions.
 * On garde les quotients à gauche et les restes à droite pour reproduire le calcul posé.
 * @param {number} valeurDecimale - Valeur en base 10.
 * @param {number} baseCible - Base d'arrivée.
 * @param {Array<{courant: number, quotient: number, reste: number}>} divisionsOrdonnees - Divisions déjà triées.
 * @returns {string} Fragment HTML à injecter dans la page.
 */
function construireArbreDivisions(valeurDecimale, baseCible, divisionsOrdonnees) {
  const divisionsAvecRestes = divisionsOrdonnees.map((division) => ({
    ...division,
    resteAffiche: obtenirChiffre(division.reste)
  }));

  const restesDuBasVersLeHaut = divisionsAvecRestes
    .slice()
    .reverse()
    .map((division) => division.resteAffiche);

  return `
    <div class="tree-meta">Conversion de ${valeurDecimale} en base ${baseCible}</div>
    <div class="tree-layout">
      <div class="tree-left">
        ${divisionsAvecRestes
          .map((division, index) => `
            <div class="tree-row">
              <div class="tree-current">${division.courant}</div>
              <div class="tree-divider">÷ ${baseCible} =</div>
              <div class="tree-quotient">${division.quotient}</div>
            </div>
          `)
          .join("")}
      </div>
      <div class="tree-right">
        <div class="tree-label">Reste</div>
        ${divisionsAvecRestes
          .map((division) => `<div class="tree-remainder">${division.resteAffiche}</div>`)
          .join("")}
      </div>
    </div>
    <div class="tree-footer">
      On lit les restes de bas en haut : ${restesDuBasVersLeHaut.join(" / ")}.
    </div>
  `;
}

/**
 * Lance la conversion choisie par l'utilisateur.
 * C'est la fonction centrale : elle lit la saisie, vérifie la base,
 * calcule le résultat et choisit l'affichage adapté.
 */
function convertirNombre() {
  const valeurSaisie = champNombre.value.trim();
  const baseDepart = Number(baseDepartSelect.value);
  const baseArrivee = Number(baseArriveeSelect.value);
  const modeChoisi = modeSelect.value;

  zoneMessage.textContent = "";
  zoneResultat.textContent = "-";
  afficherEtapes(["Aucune étape pour le moment."]);
  afficherArbre("");

  if (!valeurSaisie) {
    zoneMessage.textContent = "Veuillez saisir un nombre.";
    return;
  }

  if (!nombreValidePourBase(valeurSaisie, baseDepart)) {
    zoneMessage.textContent = "Le nombre saisi ne correspond pas à la base de départ.";
    return;
  }

  const valeurDecimale = parseInt(valeurSaisie, baseDepart);

  if (Number.isNaN(valeurDecimale)) {
    zoneMessage.textContent = "Conversion impossible. Vérifiez la saisie.";
    return;
  }

  const lectureSource = lireNombreAvecPuissances(valeurSaisie, baseDepart);
  const conversionCible = calculerDivisionsSuccessives(valeurDecimale, baseArrivee);

  // Si les deux bases sont identiques, il n'y a pas de conversion à faire.
  if (baseDepart === baseArrivee) {
    zoneResultat.textContent = valeurSaisie.toUpperCase();
    afficherEtapes([
      `La base de départ et la base d'arrivée sont identiques (${baseDepart}).`,
      `Le nombre ne change pas : ${valeurSaisie.toUpperCase()}.`
    ]);
    afficherArbre("");
    return;
  }

  // Le mode arbre affiche la méthode complète, comme sur une copie d'élève.
  zoneResultat.textContent = conversionCible.resultat;

  if (modeChoisi === "tree") {
    afficherEtapes([]);
    afficherArbre(conversionCible.arbre);
    return;
  }

  afficherEtapes([
    ...lectureSource.etapes,
    `Puis on écrit ${lectureSource.valeurDecimale} dans la base ${baseArrivee} par divisions successives.`
  ]);
  afficherArbre("");
}

boutonConvertir.addEventListener("click", convertirNombre);

champNombre.addEventListener("keydown", (evenement) => {
  if (evenement.key === "Enter") {
    convertirNombre();
  }
});
