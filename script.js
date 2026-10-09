let Clases = [
    "Barbaro", "Bardo", "Clerigo", "Druida", "Explorador", "Guerrero", "Hechicero", "Mago", "Monje", "Paladin", "Picaro", "Brujo"
];

function ClaseRandom() {
    let indice = [];
    let temp = -1;
    indice.push(Math.floor(Math.random() * Clases.length));
    do {
        temp = Math.floor(Math.random() * Clases.length);
        if (!indice.includes(temp)) {
            indice.push(temp);
        }
    }while (indice.length < 3);
    
    return indice;
}