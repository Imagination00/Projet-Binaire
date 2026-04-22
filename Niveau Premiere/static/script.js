const champNombre = document.getElementById("numberInput");
const baseDepartSelect = document.getElementById("fromBase");
const baseArriveeSelect = document.getElementById("toBase");
const boutonConvertir = document.getElementById("convertBtn");
const zoneResultat = document.getElementById("result");
const zoneMessage = document.getElementById("feedback");
const listeEtapes = document.getElementById("steps");

const CHIFFRES = "0123456789ABCDEF";

// TODO 1
// Completer la fonction pour convertir un caractere en valeur numerique.
// Exemples attendus: "A" -> 10, "F" -> 15, "7" -> 7
function obtenirValeurChiffre(caractere) {
  // Etape suggeree:
  // 1) passer le caractere en majuscule
  // 2) renvoyer sa position dans CHIFFRES
  return -1;
}

// TODO 2
// Completer la validation pour les bases 2, 8, 10, 16.
function nombreValidePourBase(valeur, base) {
  const motifs = {
    2: /a^/,
    8: /a^/,
    10: /a^/,
    16: /a^/
  };

  // Remplacer les motifs temporaires ci-dessus par les bons motifs regex.
  return motifs[base].test(valeur);
}

function afficherEtapes(etapes) {
  listeEtapes.innerHTML = etapes.map((etape) => `<li>${etape}</li>`).join("");
}

// TODO 3
// Completer la lecture positionnelle d'un nombre dans sa base de depart.
// La fonction doit renvoyer:
// - valeurDecimale: la valeur en base 10
// - etapes: un tableau de textes explicatifs
function lireNombreAvecPuissances(valeurSource, baseSource) {
  // Piste:
  // - decouper la chaine en tableau de caracteres
  // - pour chaque chiffre, calculer la puissance associee
  // - faire la somme valeurChiffre * baseSource^puissance
  const expression = "A completer";

  return {
    valeurDecimale: 0,
    etapes: [
      `On decompose ${valeurSource} en puissances de ${baseSource}.`,
      `${expression} = ?`
    ]
  };
}

// TODO 4
// Completer l'algorithme des divisions successives.
// Rappel: on divise par la base cible et on garde les restes.
function calculerDivisionsSuccessives(valeurDecimale, baseCible) {
  if (valeurDecimale === 0) {
    return {
      resultat: "0",
      etapes: ["0 reste 0 dans toutes les bases."]
    };
  }

  const divisions = [];
  let courant = valeurDecimale;

  // A completer: boucle des divisions successives.
  // while (...) {
  //   const quotient = ...
  //   const reste = ...
  //   divisions.push({ courant, quotient, reste });
  //   courant = ...
  // }

  if (divisions.length === 0) {
    return {
      resultat: "A_COMPLETER",
      etapes: ["Completer l'algorithme des divisions successives."]
    };
  }

  const resultat = divisions
    .map((division) => CHIFFRES[division.reste])
    .reverse()
    .join("");

  const etapes = divisions.map(
    (division) => `${division.courant} = ${division.quotient} x ${baseCible} + ${CHIFFRES[division.reste]}`
  );

  etapes.push(`Lecture des restes de bas en haut -> ${resultat}.`);

  return {
    resultat,
    etapes
  };
}

function convertirNombre() {
  const valeurSaisie = champNombre.value.trim();
  const baseDepart = Number(baseDepartSelect.value);
  const baseArrivee = Number(baseArriveeSelect.value);

  zoneMessage.textContent = "";
  zoneResultat.textContent = "-";
  afficherEtapes(["Aucune etape pour le moment."]);

  if (!valeurSaisie) {
    zoneMessage.textContent = "Veuillez saisir un nombre.";
    return;
  }

  if (!nombreValidePourBase(valeurSaisie, baseDepart)) {
    zoneMessage.textContent = "Le nombre saisi ne correspond pas a la base de depart.";
    return;
  }

  if (baseDepart === baseArrivee) {
    zoneResultat.textContent = valeurSaisie.toUpperCase();
    afficherEtapes([
      `La base de depart et la base d'arrivee sont identiques (${baseDepart}).`,
      `Le nombre ne change pas : ${valeurSaisie.toUpperCase()}.`
    ]);
    return;
  }

  const lectureSource = lireNombreAvecPuissances(valeurSaisie, baseDepart);
  const conversionCible = calculerDivisionsSuccessives(lectureSource.valeurDecimale, baseArrivee);

  zoneResultat.textContent = conversionCible.resultat;
  afficherEtapes([
    ...lectureSource.etapes,
    `Puis on convertit ${lectureSource.valeurDecimale} vers la base ${baseArrivee}.`,
    ...conversionCible.etapes
  ]);
}

boutonConvertir.addEventListener("click", convertirNombre);

champNombre.addEventListener("keydown", (evenement) => {
  if (evenement.key === "Enter") {
    convertirNombre();
  }
});
