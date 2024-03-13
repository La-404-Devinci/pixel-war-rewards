const sentences = [
    "Préparez-vous pour la bataille!",
    "Rejoignez le combat!",
    "Défendez les pixels!",
    "PIIIIIXEEEEEELLLLLLSSSSS!",
    "Libérez votre créativité!",
    "WAAAZZZAAAA !!!",
    "Prêt à combattre?",
    "C'est bientôt l'heure!",
];

function changeTitle() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const randomSentence = sentences[randomIndex];
    document.title = randomSentence;
}

setInterval(changeTitle, 15000);
