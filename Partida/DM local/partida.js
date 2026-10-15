const SAVE_KEY = "dndRoguelikeCampaignSave";
const CLASS_HISTORY_LIMIT = 10;
const MONSTER_API_BASE = "https://www.dnd5eapi.co/api/2014/monsters/";
const monsterCache = new Map();
const brokenCreatureImageUrls = new Set();
const CREATURE_IMAGE_URLS = {
    "abominable-yeti": "https://5e.tools/img/bestiary/tokens/XMM/Abominable%20Yeti.webp",
    "adult-blue-dragon": "https://5e.tools/img/bestiary/tokens/XMM/Adult%20Blue%20Dragon.webp",
    "adult-crystal-dragon": "https://5e.tools/img/bestiary/tokens/FTD/Adult%20Crystal%20Dragon.webp",
    "adult-deep-dragon": "https://5e.tools/img/bestiary/tokens/FTD/Adult%20Deep%20Dragon.webp",
    "adult-red-dragon": "https://5e.tools/img/bestiary/tokens/XMM/Adult%20Red%20Dragon.webp",
    "archmage": "https://5e.tools/img/bestiary/tokens/XMM/Archmage.webp",
    "air-elemental": "https://5e.tools/img/bestiary/tokens/XMM/Air%20Elemental.webp",
    "ancient-red-dragon": "https://5e.tools/img/bestiary/tokens/XMM/Ancient%20Red%20Dragon.webp",
    "babau": "https://5e.tools/img/bestiary/tokens/VGM/Babau.webp",
    "bandit": "https://5e.tools/img/bestiary/tokens/XMM/Bandit.webp",
    "bandit-captain": "https://5e.tools/img/bestiary/tokens/XMM/Bandit%20Captain.webp",
    "banshee": "https://5e.tools/img/bestiary/tokens/XMM/Banshee.webp",
    "barlgura": "https://5e.tools/img/bestiary/tokens/MM/Barlgura.webp",
    "beholder": "https://5e.tools/img/bestiary/tokens/XMM/Beholder.webp",
    "beholder-zombie": "https://5e.tools/img/bestiary/tokens/XMM/Beholder%20Zombie.webp",
    "black-bear": "https://5e.tools/img/bestiary/tokens/XMM/Black%20Bear.webp",
    "boar": "https://5e.tools/img/bestiary/tokens/XMM/Boar.webp",
    "brown-bear": "https://5e.tools/img/bestiary/tokens/XMM/Brown%20Bear.webp",
    "bugbear": "https://5e.tools/img/bestiary/tokens/MM/Bugbear.webp",
    "chasme": "https://5e.tools/img/bestiary/tokens/XMM/Chasme.webp",
    "chimera": "https://5e.tools/img/bestiary/tokens/XMM/Chimera.webp",
    "chuul": "https://5e.tools/img/bestiary/tokens/XMM/Chuul.webp",
    "cloud-giant": "https://5e.tools/img/bestiary/tokens/XMM/Cloud%20Giant.webp",
    "death-slaad": "https://5e.tools/img/bestiary/tokens/XMM/Death%20Slaad.webp",
    "deathlock": "https://5e.tools/img/bestiary/tokens/MTF/Deathlock.webp",
    "demilich": "https://5e.tools/img/bestiary/tokens/XMM/Demilich.webp",
    "dire-wolf": "https://5e.tools/img/bestiary/tokens/XMM/Dire%20Wolf.webp",
    "dragonborn-of-bahamut": "https://5e.tools/img/bestiary/tokens/FTD/Dragonborn%20of%20Bahamut.webp",
    "earth-elemental": "https://5e.tools/img/bestiary/tokens/XMM/Earth%20Elemental.webp",
    "elephant": "https://5e.tools/img/bestiary/tokens/XMM/Elephant.webp",
    "ettercap": "https://5e.tools/img/bestiary/tokens/XMM/Ettercap.webp",
    "ettin": "https://5e.tools/img/bestiary/tokens/XMM/Ettin.webp",
    "fire-elemental": "https://5e.tools/img/bestiary/tokens/XMM/Fire%20Elemental.webp",
    "fire-giant": "https://5e.tools/img/bestiary/tokens/XMM/Fire%20Giant.webp",
    "frost-giant": "https://5e.tools/img/bestiary/tokens/XMM/Frost%20Giant.webp",
    "giant-centipede": "https://5e.tools/img/bestiary/tokens/XMM/Giant%20Centipede.webp",
    "giant-spider": "https://5e.tools/img/bestiary/tokens/XMM/Giant%20Spider.webp",
    "gladiator": "https://5e.tools/img/bestiary/tokens/XMM/Gladiator.webp",
    "gnoll": "https://5e.tools/img/bestiary/tokens/MM/Gnoll.webp",
    "goblin": "https://5e.tools/img/bestiary/tokens/XMM/Goblin%20Minion.webp",
    "goblin-boss": "https://5e.tools/img/bestiary/tokens/XMM/Goblin%20Boss.webp",
    "guard": "https://5e.tools/img/bestiary/tokens/XMM/Guard.webp",
    "hobgoblin": "https://5e.tools/img/bestiary/tokens/MM/Hobgoblin.webp",
    "hobgoblin-captain": "https://5e.tools/img/bestiary/tokens/XMM/Hobgoblin%20Captain.webp",
    "hydra": "https://5e.tools/img/bestiary/tokens/XMM/Hydra.webp",
    "hunter-shark": "https://5e.tools/img/bestiary/tokens/XMM/Hunter%20Shark.webp",
    "intellect-devourer": "https://5e.tools/img/bestiary/tokens/XMM/Intellect%20Devourer.webp",
    "kenku": "https://5e.tools/img/bestiary/tokens/XMM/Kenku.webp",
    "kobold": "https://5e.tools/img/bestiary/tokens/MM/Kobold.webp",
    "kraken-priest": "https://5e.tools/img/bestiary/tokens/VGM/Kraken%20Priest.webp",
    "lion": "https://5e.tools/img/bestiary/tokens/XMM/Lion.webp",
    "lich": "https://5e.tools/img/bestiary/tokens/XMM/Lich.webp",
    "mage": "https://5e.tools/img/bestiary/tokens/XMM/Mage.webp",
    "magmin": "https://5e.tools/img/bestiary/tokens/XMM/Magmin.webp",
    "manticore": "https://5e.tools/img/bestiary/tokens/XMM/Manticore.webp",
    "mezzoloth": "https://5e.tools/img/bestiary/tokens/XMM/Mezzoloth.webp",
    "mind-flayer": "https://5e.tools/img/bestiary/tokens/XMM/Mind%20Flayer.webp",
    "minotaur": "https://5e.tools/img/bestiary/tokens/MM/Minotaur.webp",
    "mummy": "https://5e.tools/img/bestiary/tokens/XMM/Mummy.webp",
    "mummy-lord": "https://5e.tools/img/bestiary/tokens/XMM/Mummy%20Lord.webp",
    "oni": "https://5e.tools/img/bestiary/tokens/XMM/Oni.webp",
    "orc": "https://5e.tools/img/bestiary/tokens/MM/Orc.webp",
    "owlbear": "https://5e.tools/img/bestiary/tokens/XMM/Owlbear.webp",
    "polar-bear": "https://5e.tools/img/bestiary/tokens/XMM/Polar%20Bear.webp",
    "rakshasa": "https://5e.tools/img/bestiary/tokens/XMM/Rakshasa.webp",
    "revenant": "https://5e.tools/img/bestiary/tokens/XMM/Revenant.webp",
    "rot-troll": "https://5e.tools/img/bestiary/tokens/MTF/Rot%20Troll.webp",
    "skeleton": "https://5e.tools/img/bestiary/tokens/XMM/Skeleton.webp",
    "spectator": "https://5e.tools/img/bestiary/tokens/XMM/Spectator.webp",
    "spined-devil": "https://5e.tools/img/bestiary/tokens/XMM/Spined%20Devil.webp",
    "stone-golem": "https://5e.tools/img/bestiary/tokens/XMM/Stone%20Golem.webp",
    "troll": "https://5e.tools/img/bestiary/tokens/XMM/Troll.webp",
    "blue-slaad": "https://5e.tools/img/bestiary/tokens/XMM/Blue%20Slaad.webp",
    "swarm-of-bats": "https://5e.tools/img/bestiary/tokens/XMM/Swarm%20of%20Bats.webp",
    "vampire-spawn": "https://5e.tools/img/bestiary/tokens/XMM/Vampire%20Spawn.webp",
    "veteran": "https://5e.tools/img/bestiary/tokens/MM/Veteran.webp",
    "werewolf": "https://5e.tools/img/bestiary/tokens/XMM/Werewolf.webp",
    "water-elemental": "https://5e.tools/img/bestiary/tokens/XMM/Water%20Elemental.webp",
    "wight": "https://5e.tools/img/bestiary/tokens/XMM/Wight.webp",
    "wolf": "https://5e.tools/img/bestiary/tokens/XMM/Wolf.webp",
    "young-white-dragon": "https://5e.tools/img/bestiary/tokens/XMM/Young%20White%20Dragon.webp",
    "wyvern": "https://5e.tools/img/bestiary/tokens/XMM/Wyvern.webp",
    "zombie": "https://5e.tools/img/bestiary/tokens/XMM/Zombie.webp"
};

const creatureCatalog = [
    { name: "Dragón nacido de Bahamut", aliases: ["dragonborn of bahamut"], slug: "dragonborn-of-bahamut" },
    { name: "Oso lechuza", aliases: ["oso lechuza", "owlbear", "owlbears"], slug: "owlbear" },
    { name: "Oso polar", aliases: ["oso polar", "polar bear"], slug: "polar-bear" },
    { name: "Oso pardo", aliases: ["oso pardo", "brown bear"], slug: "brown-bear" },
    { name: "Oso negro", aliases: ["oso negro", "black bear"], slug: "black-bear" },
    { name: "Dragón blanco joven", aliases: ["young white dragon", "young white dragons"], slug: "young-white-dragon" },
    { name: "Dragón rojo antiguo", aliases: ["red dragon wyrm", "red dragon wyrms"], slug: "ancient-red-dragon" },
    { name: "Dragón rojo adulto", aliases: ["adult red dragon"], slug: "adult-red-dragon" },
    { name: "Dragón cristalino adulto", aliases: ["adult crystal dragon"], slug: "adult-crystal-dragon" },
    { name: "Dragón de las profundidades adulto", aliases: ["adult deep dragon"], slug: "adult-deep-dragon" },
    { name: "Dragón azul adulto", aliases: ["adult blue dragon"], slug: "adult-blue-dragon" },
    { name: "Araña gigante", aliases: ["giant spiders", "giant spider", "arañas gigantes", "araña gigante"], slug: "giant-spider" },
    { name: "Lobo terrible", aliases: ["dire wolves", "dire wolf"], slug: "dire-wolf" },
    { name: "Jefe goblin", aliases: ["goblin bosses", "goblin boss"], slug: "goblin-boss" },
    { name: "Capitán hobgoblin", aliases: ["hobgoblin captains", "hobgoblin captain"], slug: "hobgoblin-captain" },
    { name: "Gnoll cazador", aliases: ["gnoll hunter", "gnoll hunters"], slug: "gnoll" },
    { name: "Beholder zombi", aliases: ["beholder zombies", "beholder zombie"], slug: "beholder-zombie" },
    { name: "Capitán bandido", aliases: ["bandit captains", "bandit captain", "capitán bandido", "capitan bandido"], slug: "bandit-captain" },
    { name: "Trol putrefacto", aliases: ["rot trolls", "rot troll"], slug: "rot-troll" },
    { name: "Elemental de fuego", aliases: ["fire elementals", "fire elemental", "elemental de fuego"], slug: "fire-elemental" },
    { name: "Elemental de aire", aliases: ["air elementals", "air elemental"], slug: "air-elemental" },
    { name: "Engendro vampírico", aliases: ["vampire spawns", "vampire spawn"], slug: "vampire-spawn" },
    { name: "Ciempiés gigante", aliases: ["giant centipedes", "giant centipede"], slug: "giant-centipede" },
    { name: "Dragón blanco joven", aliases: ["young white dragons"], slug: "young-white-dragon" },
    { name: "Gigante de escarcha", aliases: ["frost giants", "frost giant"], slug: "frost-giant" },
    { name: "Gigante de las nubes", aliases: ["cloud giants", "cloud giant"], slug: "cloud-giant" },
    { name: "Diablo espinoso", aliases: ["spined devils", "spined devil"], slug: "spined-devil" },
    { name: "Azotamentes", aliases: ["mind flayers", "mind flayer"], slug: "mind-flayer" },
    { name: "Devorador de intelecto", aliases: ["intellect devourers", "intellect devourer"], slug: "intellect-devourer" },
    { name: "Enjambre de murciélagos", aliases: ["swarm of bats"], slug: "swarm-of-bats" },
    { name: "Slaad de la muerte", aliases: ["death slaad"], slug: "death-slaad" },
    { name: "Gigante de fuego", aliases: ["fire giants", "fire giant"], slug: "fire-giant" },
    { name: "Guerrero momificado", aliases: ["mummified warriors", "mummified warrior"], slug: "mummified-warrior" },
    { name: "Sacerdote kraken", aliases: ["kraken priests", "kraken priest"], slug: "kraken-priest" },
    { name: "Tiburón cazador", aliases: ["hunter sharks", "hunter shark"], slug: "hunter-shark" },
    { name: "Slaad azul", aliases: ["blue slaadi", "blue slaad"], slug: "blue-slaad" },
    { name: "Gólem de piedra", aliases: ["stone golems", "stone golem"], slug: "stone-golem" },
    { name: "Señor momia", aliases: ["mummy lords", "mummy lord"], slug: "mummy-lord" },
    { name: "Jabalí", aliases: ["jabalí", "jabali", "boar"], slug: "boar" },
    { name: "Goblin", aliases: ["goblins", "goblin"], slug: "goblin" },
    { name: "Kobold", aliases: ["kobolds", "kobold"], slug: "kobold" },
    { name: "Bugbear", aliases: ["bugbears", "bugbear"], slug: "bugbear" },
    { name: "Kenku", aliases: ["kenku"], slug: "kenku" },
    { name: "Orco", aliases: ["orcos", "orc"], slug: "orc" },
    { name: "Hobgoblin", aliases: ["hobgoblins", "hobgoblin"], slug: "hobgoblin" },
    { name: "Oso", aliases: ["oso", "bear"], slug: "brown-bear" },
    { name: "Lobo", aliases: ["wolves", "wolf", "lobos", "lobo"], slug: "wolf" },
    { name: "Wight", aliases: ["wights", "wight"], slug: "wight" },
    { name: "Gnoll", aliases: ["gnolls", "gnoll"], slug: "gnoll" },
    { name: "Oso lechuza", aliases: ["owlbear"], slug: "owlbear" },
    { name: "Manticora", aliases: ["manticoras", "manticore", "manticora"], slug: "manticore" },
    { name: "Minotauro", aliases: ["minotauros", "minotaur", "minotauro"], slug: "minotaur" },
    { name: "Spectator", aliases: ["spectators", "spectator"], slug: "spectator" },
    { name: "Esqueleto", aliases: ["skeletons", "skeleton", "esqueletos", "esqueleto"], slug: "skeleton" },
    { name: "Zombi", aliases: ["zombies", "zombie", "zombis", "zombi"], slug: "zombie" },
    { name: "Momia", aliases: ["mummies", "mummy", "momias", "momia"], slug: "mummy" },
    { name: "Ettercap", aliases: ["ettercaps", "ettercap"], slug: "ettercap" },
    { name: "Bandido", aliases: ["bandits", "bandit", "bandidos", "bandido"], slug: "bandit" },
    { name: "Trol", aliases: ["trolls", "troll", "troles", "trol"], slug: "troll" },
    { name: "Hombre lobo", aliases: ["werewolf", "werewolves", "hombre lobo"], slug: "werewolf" },
    { name: "Banshee", aliases: ["banshees", "banshee"], slug: "banshee" },
    { name: "Elemental aleatorio", aliases: ["elemental aleatorio"], slug: "random-elemental" },
    { name: "Elemental", aliases: ["elementales", "elemental"], slug: "air-elemental" },
    { name: "Chuul", aliases: ["chuuls", "chuul"], slug: "chuul" },
    { name: "Ettin", aliases: ["ettins", "ettin"], slug: "ettin" },
    { name: "Oni", aliases: ["onis", "oni"], slug: "oni" },
    { name: "Magmin", aliases: ["magmins", "magmin"], slug: "magmin" },
    { name: "Revenant", aliases: ["revenants", "revenant"], slug: "revenant" },
    { name: "Gladiador", aliases: ["gladiators", "gladiator"], slug: "gladiator" },
    { name: "Veterano", aliases: ["veterans", "veteran"], slug: "veteran" },
    { name: "Deathlock", aliases: ["deathlocks", "deathlock"], slug: "deathlock" },
    { name: "Mago", aliases: ["mages", "mage", "magos", "mago"], slug: "mage" },
    { name: "Abominable yeti", aliases: ["abominable yeti"], slug: "abominable-yeti" },
    { name: "Chasme", aliases: ["chasme", "chasmes"], slug: "chasme" },
    { name: "Quimera", aliases: ["chimeras", "chimera"], slug: "chimera" },
    { name: "León", aliases: ["lions", "lion", "leones", "león", "leon"], slug: "lion" },
    { name: "Hidra", aliases: ["hydras", "hydra", "hidras", "hidra"], slug: "hydra" },
    { name: "Guardia", aliases: ["guards", "guard", "guardas", "guarda"], slug: "guard" },
    { name: "Elefante", aliases: ["elephants", "elephant", "elefantes", "elefante"], slug: "elephant" },
    { name: "Mezzoloth", aliases: ["mezzoloths", "mezzoloth", "metholoth"], slug: "mezzoloth" },
    { name: "Archimago", aliases: ["archmage", "archmages"], slug: "archmage" },
    { name: "Wyvern", aliases: ["wyverns", "wyvern"], slug: "wyvern" },
    { name: "Rothe", aliases: ["rothe"], slug: "rothe" },
    { name: "Liche", aliases: ["liches", "lich"], slug: "lich" },
    { name: "Beholder", aliases: ["beholders", "beholder"], slug: "beholder" },
    { name: "Demiliche", aliases: ["demiliches", "demilich"], slug: "demilich" },
    { name: "Dragón nacido de Bahamut", aliases: ["dragonborn of bahamut"], slug: "dragonborn-of-bahamut" },
    { name: "Cangrejo de tormenta", aliases: ["storm crab"], slug: "storm-crab" },
    { name: "Babau", aliases: ["babaus", "babau"], slug: "babau" },
    { name: "Rakshasa", aliases: ["rakshasas", "rakshasa"], slug: "rakshasa" },
    { name: "Barlgura", aliases: ["barlguras", "barlgura"], slug: "barlgura" },
    { name: "Dragón rojo antiguo", aliases: ["red dragon wyrm"], slug: "ancient-red-dragon" }
];

let gameData;
let characterLibrary;
let state = createInitialState();
let timerInterval;

function createInitialState() {
    return {
        version: 1,
        phase: "setup",
        floor: 1,
        floors: {},
        classHistory: [],
        chosenEmblems: [],
        updatedAt: new Date().toISOString()
    };
}

function randomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
}

function sampleWithoutReplacement(items, count) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function currentRecord() {
    return state.floors[state.floor] || null;
}

function saveState(message = "Partida guardada automáticamente en este navegador.") {
    state.updatedAt = new Date().toISOString();
    try {
        const sanitized = sanitizeStateForStorage(state);
        localStorage.setItem(SAVE_KEY, JSON.stringify(sanitized));
        document.getElementById("save-status").textContent = message;
    } catch {
        document.getElementById("save-status").textContent = "El navegador no permite el guardado automático. Descarga un JSON con «Guardar partida».";
    }
}

function sanitizeStateForStorage(source) {
    const snapshot = JSON.parse(JSON.stringify(source));
    if (snapshot.floors) {
        Object.values(snapshot.floors).forEach((record) => {
            if (record) delete record.chosenClass;
        });
    }
    if (Array.isArray(snapshot.classHistory)) {
        snapshot.classHistory = snapshot.classHistory.map(({ chosen, ...rest }) => rest);
    }
    return snapshot;
}

function showStatus(message, isError = false) {
    const status = document.getElementById("save-status");
    status.textContent = message;
    status.classList.toggle("error-status", isError);
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function loadMonster(slug) {
    if (!monsterCache.has(slug)) {
        const request = fetch(`${MONSTER_API_BASE}${slug}`)
            .then((response) => {
                if (!response.ok) throw new Error("No hay una ficha SRD disponible para esta criatura.");
                return response.json();
            })
            .catch(() => null);
        monsterCache.set(slug, request);
    }
    return monsterCache.get(slug);
}

function findEncounterCreatures(encounter) {
    const aliases = creatureCatalog.flatMap((creature) => creature.aliases.map((alias) => ({ creature, alias })))
        .sort((first, second) => second.alias.length - first.alias.length);
    const unmatchedText = { value: encounter.toLocaleLowerCase("es") };
    const found = new Map();
    aliases.forEach(({ creature, alias }) => {
        const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const expression = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapedAlias})(?=$|[^\\p{L}\\p{N}])`, "iu");
        const match = expression.exec(unmatchedText.value);
        if (!match) return;
        if (!found.has(creature.slug)) found.set(creature.slug, creature);
        const start = match.index + match[1].length;
        unmatchedText.value = `${unmatchedText.value.slice(0, start)}${" ".repeat(match[2].length)}${unmatchedText.value.slice(start + match[2].length)}`;
    });
    return [...found.values()];
}

function setCreatureImage(image, fallback, urls) {
    const candidates = [...new Set(urls.filter(Boolean))]
        .filter((url) => !brokenCreatureImageUrls.has(url));
    let index = 0;
    image.hidden = false;
    image.classList.add("is-loading");
    if (fallback) fallback.hidden = false;

    const tryNext = () => {
        if (index >= candidates.length) {
            image.hidden = true;
            image.classList.remove("is-loading");
            if (fallback) fallback.hidden = false;
            return;
        }
        const url = candidates[index++];
        image.onload = () => {
            image.classList.remove("is-loading");
            if (fallback) fallback.hidden = true;
        };
        image.onerror = () => {
            brokenCreatureImageUrls.add(url);
            image.classList.add("is-loading");
            tryNext();
        };
        image.src = url;
    };

    tryNext();
}

function renderCreatureReferences(encounter) {
    const list = document.getElementById("creature-reference-list");
    list.replaceChildren();
    const creatures = findEncounterCreatures(encounter);
    if (!creatures.length) return;

    creatures.forEach((creature) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "creature-reference";
        button.setAttribute("aria-label", `Ver imagen y statblock: ${creature.name}`);
        const image = document.createElement("img");
        image.alt = "";
        image.loading = "eager";
        const fallback = document.createElement("span");
        fallback.className = "creature-image-fallback";
        fallback.setAttribute("aria-hidden", "true");
        fallback.textContent = "✦";
        const imageUrl = creature.imageUrl || CREATURE_IMAGE_URLS[creature.slug];
        const name = document.createElement("span");
        name.className = "creature-reference-name";
        name.textContent = creature.name;
        const hint = document.createElement("span");
        hint.className = "creature-reference-hint";
        hint.textContent = "Ver ficha →";
        const imageFrame = document.createElement("span");
        imageFrame.className = "creature-image-frame";
        imageFrame.append(image, fallback);
        button.append(imageFrame, name, hint);
        button.addEventListener("click", () => creature.slug === "random-elemental"
            ? showRandomElementalChoices()
            : showMonsterStatblock(creature));
        list.append(button);

        setCreatureImage(image, fallback, [imageUrl]);
    });
}

function appendStatblockSection(container, title, entries) {
    if (!entries?.length) return;
    const section = document.createElement("section");
    section.className = "statblock-section";
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.append(heading);
    entries.forEach((entry) => {
        const item = document.createElement("article");
        item.className = "statblock-entry";
        const name = document.createElement("h4");
        name.textContent = entry.name;
        const description = document.createElement("p");
        description.textContent = entry.desc;
        item.append(name, description);
        section.append(item);
    });
    container.append(section);
}

function renderMonsterStatblock(monster, creature) {
    const container = document.getElementById("monster-statblock");
    container.replaceChildren();
    const portrait = document.createElement("div");
    portrait.className = "statblock-summary";
    const image = document.createElement("img");
    image.alt = `Token de ${monster.name}`;
    const imageFallback = document.createElement("span");
    imageFallback.className = "statblock-image-fallback";
    imageFallback.setAttribute("aria-label", `No hay token disponible para ${monster.name}`);
    imageFallback.textContent = "✦";
    const imageFrame = document.createElement("div");
    imageFrame.className = "statblock-image-frame";
    imageFrame.append(image, imageFallback);
    portrait.append(imageFrame);
    setCreatureImage(image, imageFallback, [creature?.imageUrl, CREATURE_IMAGE_URLS[creature?.slug]]);
    const summary = document.createElement("div");
    const meta = document.createElement("p");
    meta.className = "statblock-meta";
    meta.textContent = `${monster.size} ${monster.type}${monster.subtype ? ` (${monster.subtype})` : ""}, ${monster.alignment}`;
    const vitalStats = document.createElement("p");
    vitalStats.className = "statblock-vitals";
    const armorClass = Array.isArray(monster.armor_class) ? monster.armor_class.map((entry) => entry.value).join(" / ") : monster.armor_class;
    vitalStats.textContent = `CA ${armorClass ?? "—"} · PG ${monster.hit_points ?? "—"}${monster.hit_dice ? ` (${monster.hit_dice})` : ""} · Velocidad ${Object.entries(monster.speed || {}).map(([kind, speed]) => `${kind} ${speed}`).join(", ") || "—"}`;
    const challenge = document.createElement("p");
    challenge.className = "statblock-meta";
    challenge.textContent = `Desafío ${monster.challenge_rating ?? "—"}${monster.xp ? ` · ${monster.xp} PX` : ""} · Bonificador de competencia +${monster.proficiency_bonus ?? "—"}`;
    summary.append(meta, vitalStats, challenge);
    portrait.append(summary);
    container.append(portrait);

    const abilities = document.createElement("div");
    abilities.className = "ability-grid";
    [["FUE", "strength"], ["DES", "dexterity"], ["CON", "constitution"], ["INT", "intelligence"], ["SAB", "wisdom"], ["CAR", "charisma"]].forEach(([label, key]) => {
        const score = document.createElement("div");
        const modifier = Math.floor(((monster[key] || 10) - 10) / 2);
        const statLabel = document.createElement("span");
        statLabel.textContent = label;
        const value = document.createElement("strong");
        value.textContent = monster[key] ?? "—";
        const bonus = document.createElement("small");
        bonus.textContent = `${modifier >= 0 ? "+" : ""}${modifier}`;
        score.append(statLabel, value, bonus);
        abilities.append(score);
    });
    container.append(abilities);

    const details = [
        ["Tiradas de salvación", monster.proficiencies?.filter((entry) => entry.proficiency.index.startsWith("saving-throw")).map((entry) => `${entry.proficiency.name.replace("Saving Throw: ", "")}: +${entry.value}`)],
        ["Habilidades", monster.proficiencies?.filter((entry) => entry.proficiency.index.startsWith("skill-")).map((entry) => `${entry.proficiency.name.replace("Skill: ", "")}: +${entry.value}`)],
        ["Resistencias", monster.damage_resistances],
        ["Vulnerabilidades", monster.damage_vulnerabilities],
        ["Inmunidades", [...(monster.damage_immunities || []), ...(monster.condition_immunities || []).map((entry) => entry.name)]],
        ["Sentidos", [...Object.entries(monster.senses || {}).map(([key, value]) => `${key.replaceAll("_", " ")}: ${value}`), ...(monster.languages ? [`Idiomas: ${monster.languages}`] : [])]]
    ];
    const detailsGrid = document.createElement("div");
    detailsGrid.className = "statblock-details";
    details.forEach(([label, values]) => {
        if (!values?.length) return;
        const detail = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        detail.append(strong, document.createTextNode(values.join(", ")));
        detailsGrid.append(detail);
    });
    if (detailsGrid.childElementCount) container.append(detailsGrid);
    appendStatblockSection(container, "Rasgos", monster.special_abilities);
    appendStatblockSection(container, "Acciones", monster.actions);
    appendStatblockSection(container, "Reacciones", monster.reactions);
    appendStatblockSection(container, "Acciones legendarias", monster.legendary_actions);
}

async function showMonsterStatblock(creature) {
    const dialog = document.getElementById("monster-dialog");
    const title = document.getElementById("monster-dialog-title");
    const content = document.getElementById("monster-statblock");
    title.textContent = creature.name;
    content.textContent = "Cargando ficha de criatura…";
    if (!dialog.open) dialog.showModal();
    const monster = await loadMonster(creature.slug);
    if (title.textContent !== creature.name || !dialog.open) return;
    if (!monster) {
        const message = document.createElement("p");
        message.className = "statblock-unavailable";
        message.textContent = `No se encontró una ficha SRD para ${creature.name}. Puede pertenecer a un suplemento no incluido en la API.`;
        content.replaceChildren();
        const imageUrl = creature.imageUrl || CREATURE_IMAGE_URLS[creature.slug];
        const portrait = document.createElement("div");
        portrait.className = "statblock-summary";
        const image = document.createElement("img");
        image.loading = "eager";
        image.alt = `Token de ${creature.name}`;
        const imageFallback = document.createElement("span");
        imageFallback.className = "statblock-image-fallback";
        imageFallback.setAttribute("aria-label", `No hay token disponible para ${creature.name}`);
        imageFallback.textContent = "✦";
        const imageFrame = document.createElement("div");
        imageFrame.className = "statblock-image-frame";
        imageFrame.append(image, imageFallback);
        portrait.append(imageFrame);
        setCreatureImage(image, imageFallback, [imageUrl]);
        content.append(portrait);
        content.append(message);
        return;
    }
    title.textContent = monster.name;
    renderMonsterStatblock(monster, creature);
}

function showRandomElementalChoices() {
    const dialog = document.getElementById("monster-dialog");
    const title = document.getElementById("monster-dialog-title");
    const content = document.getElementById("monster-statblock");
    title.textContent = "Elemental aleatorio";
    content.replaceChildren();
    const prompt = document.createElement("p");
    prompt.className = "statblock-meta";
    prompt.textContent = "Elige qué resultado salió en el d4 para consultar la ficha correspondiente:";
    const choices = document.createElement("div");
    choices.className = "elemental-choices";
    [
        ["Elemental de aire", "air-elemental"],
        ["Elemental de tierra", "earth-elemental"],
        ["Elemental de fuego", "fire-elemental"],
        ["Elemental de agua", "water-elemental"]
    ].forEach(([name, slug]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "elemental-choice-button";
        button.textContent = name;
        button.addEventListener("click", () => showMonsterStatblock({ name, slug }));
        choices.append(button);
    });
    content.append(prompt, choices);
    if (!dialog.open) dialog.showModal();
}

function elapsedMilliseconds(record) {
    if (!record?.timer) return 0;
    const runningFor = record.timer.startedAt ? Date.now() - record.timer.startedAt : 0;
    return Math.max(0, record.timer.elapsedMs + runningFor);
}

function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    return [hours, minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":");
}

function renderDashboard() {
    const record = currentRecord();
    const stageLabels = {
        setup: "Preparación",
        encounter: "Encuentro",
        rewards: "Recompensas y tienda",
        event: "Evento",
        complete: "Torre completada"
    };
    setText("floor-number", `${Math.min(state.floor, gameData.config.maxFloors)} / ${gameData.config.maxFloors}`);
    setText("stage-name", stageLabels[state.phase] || "Preparación");
    setText("start-floor-number", state.floor);
    setText("floor-timer", formatDuration(elapsedMilliseconds(record)));
    const timerButton = document.getElementById("timer-toggle");
    timerButton.disabled = state.phase !== "encounter" || !record;
    timerButton.textContent = record?.timer?.startedAt ? "Pausar temporizador" : "Iniciar temporizador";
    timerButton.setAttribute("aria-pressed", String(Boolean(record?.timer?.startedAt)));
}

function showPanel(id, visible) {
    document.getElementById(id).hidden = !visible;
}

function renderEncounter() {
    const record = currentRecord();
    showPanel("start-panel", state.phase === "setup");
    showPanel("encounter-panel", state.phase === "encounter");
    if (!record) return;

    setText("encounter-floor-number", state.floor);
    setText("encounter-roll", `d${record.encounterDie}: ${record.encounterRoll}`);
    setText("encounter-result", record.encounter);
    renderCreatureReferences(record.encounter);
    setText("map-result", record.map.name);
    setText("map-description", record.map.description);
    const eventResult = document.getElementById("map-event-result");
    eventResult.textContent = record.mapHasEvent ? "Sí" : "No";
    eventResult.className = record.mapHasEvent ? "event-yes" : "event-no";
    const mapEvent = record.mapEventTableRoll ? gameData.events[record.mapEventTableRoll - 1] : null;
    setText("map-event-detail", record.mapHasEvent && mapEvent
        ? `Evento de mapa · d20 ${record.mapEventTableRoll}: ${mapEvent.name} — ${mapEvent.description}`
        : "No se activa evento en este mapa.");
    setText("map-rule-note", gameData.config.encounterDieNote || "");
    const finishButton = document.getElementById("finish-encounter");
    finishButton.disabled = Boolean(record.finishedAt);
    finishButton.textContent = "Encuentro terminado · Ver recompensas →";
    if (record.finishedAt) document.getElementById("finish-encounter").textContent = "Encuentro terminado";
}

function makeRewardCard(title, amount) {
    const article = document.createElement("article");
    article.className = "reward-card";
    const label = document.createElement("span");
    label.textContent = title;
    const value = document.createElement("strong");
    value.textContent = amount || "Pendiente de confirmar";
    article.append(label, value);
    return article;
}

function renderRewards() {
    const visible = state.phase === "rewards";
    showPanel("rewards-panel", visible);
    if (!visible) return;

    const record = currentRecord();
    const floorData = gameData.floors[state.floor - 1];
    setText("reward-floor-number", state.floor);
    setText("shop-floor-number", state.floor);
    const rewards = floorData.rewards;
    const rewardGrid = document.getElementById("reward-grid");
    rewardGrid.replaceChildren(
        makeRewardCard("RECOMPENSA GENERAL", rewards.general),
        makeRewardCard("FINAL BLOW", rewards.finalBlow),
        makeRewardCard("EPIC ACTION", rewards.epicAction)
    );
    if (rewards.note) {
        const note = document.createElement("p");
        note.className = "placeholder-note";
        note.textContent = rewards.note;
        rewardGrid.append(note);
    }

    const nextFloor = state.floor + 1;
    const classNeeded = nextFloor <= gameData.config.maxFloors && nextFloor % 2 === 1;
    const levelTitle = document.getElementById("level-up-title");
    const levelMessage = document.getElementById("level-up-message");
    const classArea = document.getElementById("class-roll-area");
    if (nextFloor > gameData.config.maxFloors) {
        levelTitle.textContent = "Fin de la progresión";
        levelMessage.textContent = "Este es el último piso; no hay subida de nivel para una planta posterior.";
        classArea.hidden = true;
    } else if (classNeeded) {
        levelTitle.textContent = `Al pasar al piso ${nextFloor}: clase aleatoria`;
        levelMessage.textContent = "La clase a subir de nivel se sortea entre tres opciones. Pulsa el botón y registra la elección del grupo.";
        classArea.hidden = false;
        renderClassHistory();
        renderClassChoices();
    } else {
        levelTitle.textContent = `Al pasar al piso ${nextFloor}: clase anterior`;
        levelMessage.textContent = "Los jugadores pueden subir de nivel una clase que ya tengan en su historial; no hace falta sorteo aleatorio.";
        classArea.hidden = true;
    }

    renderShop(floorData, record);
    const finishShopping = document.getElementById("finish-shopping");
    finishShopping.disabled = classNeeded && !record.chosenClass;
    finishShopping.textContent = classNeeded && !record.chosenClass
        ? "Elige una clase para continuar"
        : "Terminar compras · Tirar evento d20 →";
}

function renderClassChoices() {
    const record = currentRecord();
    const choices = document.getElementById("class-choices");
    choices.replaceChildren();
    document.getElementById("selected-class").textContent = record.chosenClass ? `Clase elegida: ${record.chosenClass}` : "";
    if (!record.classOptions?.length) return;

    record.classOptions.forEach((className) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-card";
        button.setAttribute("aria-pressed", String(record.chosenClass === className));
        const name = document.createElement("strong");
        name.textContent = className;
        const helper = document.createElement("small");
        helper.textContent = record.chosenClass === className ? "Selección guardada" : "Elegir esta clase";
        button.append(name, helper);
        button.addEventListener("click", () => {
            record.chosenClass = className;
            saveState(`Clase elegida para el siguiente nivel: ${className}.`);
            render();
        });
        choices.append(button);
    });
}

function renderClassHistory() {
    const history = state.classHistory || [];
    const area = document.getElementById("class-history-area");
    const list = document.getElementById("class-history-list");
    area.hidden = history.length === 0;
    list.replaceChildren();
    history.forEach((draw) => {
        const item = document.createElement("li");
        const timestamp = new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(draw.createdAt));
        item.textContent = `Piso ${draw.floor} · ${timestamp}: ${draw.classes.join(" · ")}`;
        list.append(item);
    });
}

function renderShop(floorData, record) {
    const standardCatalog = [...gameData.shop.standard];
    if (state.floor >= 5) standardCatalog.push(gameData.shop.extraFromFloor5);
    const standard = document.getElementById("standard-shop");
    standard.replaceChildren(...standardCatalog.map((item) => makeShopItem(item, state.floor)));

    if (!record.specialOffers) record.specialOffers = sampleWithoutReplacement(floorData.offers, 2);
    document.getElementById("special-offers").replaceChildren(...record.specialOffers.map((item) => makeShopItem(item, state.floor, true)));
}

function itemEffectText(item, floor, isOffer) {
    const standardEffects = {
        "gafas de visión nocturna": "Mientras lleves estas lentes oscuras, tienes visión en la oscuridad hasta 18 m. Si ya posees visión en la oscuridad, estos anteojos aumentan su alcance en 18 m.",
        "poción de curación": "2d4+2",
        "libro de conjuros - componentes mágicos": "El Excel no especifica una descripción para este objeto.",
        "arma simple / marcial / distancia / escudo": "El Excel no especifica una descripción para este objeto.",
        "poción de curación superior": "4d4+4",
        "botas ligeras": "Ignoras terreno difícil.",
        "pergamino de conjuro nivel 1": "El Excel no especifica una descripción para este objeto.",
        "poción de curación mayor": "8d4+8",
        "capa de aventurero": "+2 a la iniciativa; tus ataques desarmados infligen 1d6 de daño + Fuerza.",
        "botas de explorador": "+5 pies de movimiento.",
        "brazalete de duelista": "+1 de CA mientras lleves un arma en una mano y nada en la otra.",
        "sombrero de experto": "Ignoras la limitación de nivel de los hechizos.",
        "pergamino de conjuro nivel 2": "El Excel no especifica una descripción para este objeto.",
        "armadura intermedia - pesada": "El Excel no especifica una descripción para este objeto.",
        "brazaletes del diestro": "Tiene cargas iguales al bonificador de competencia. Una vez por turno, puedes gastar una carga para obtener una acción adicional.",
        "pergamino de conjuro nivel 3": "El Excel no especifica una descripción para este objeto.",
        "pergamino de conjuro nivel 4": "El Excel no especifica una descripción para este objeto.",
        "espada pluriclase": "Arma simple, versátil (1d6/1d8), arrojadiza, ligera y +1. Gana 1d4 de daño de fuego, hielo o relámpago (a tu elección) por cada clase adicional a la primera que tengas en la build."
    };
    const offersByFloor = {
        1: {
            "piedra de la buena suerte": "+1 a las pruebas de característica y a las tiradas de salvación.",
            "amuleto de relojería": "Una vez por nivel, puedes tratar una tirada de ataque como si el resultado fuera 10.",
            "capa ondulante": "Una vez por nivel, puedes usar una acción adicional para obtener ventaja en pruebas de Interpretación y ganar 1d10 puntos de golpe temporales.",
            "flechas de relámpago (5)": "Las flechas infligen 1d4 de daño de relámpago adicional. Si el ataque es crítico, añade un dado de daño extra.",
            "piedra de afilar": "Al inicio de cada nivel puedes intentar afilar un arma marcial con 1d4: 1, el arma se rompe; 2, no pasa nada; 3–4, obtiene +1, pero no se convierte en mágica.",
            "piedra ioun defectuosa": "Puedes lanzar Counterspell como si fuera de nivel 4. Después de usar este efecto, la piedra se rompe."
        },
        2: {
            "piedra de la buena suerte": "+1 a las pruebas de característica y a las tiradas de salvación.",
            "amuleto de relojería": "Una vez por nivel, puedes tratar una tirada de ataque como si el resultado fuera 10.",
            "capa ondulante": "Una vez por nivel, puedes usar una acción adicional para obtener ventaja en pruebas de Interpretación y ganar 1d10 puntos de golpe temporales.",
            "flechas de relámpago (5)": "Las flechas infligen 1d4 de daño de relámpago adicional. Si el ataque es crítico, añade un dado de daño extra.",
            "piedra de afilar": "Al inicio de cada nivel puedes intentar afilar un arma marcial con 1d4: 1, el arma se rompe; 2, no pasa nada; 3–4, obtiene +1, pero no se convierte en mágica.",
            "piedra ioun defectuosa": "Puedes lanzar Counterspell como si fuera de nivel 4. Después de usar este efecto, la piedra se rompe."
        },
        3: {
            "botas superélficas": "Obtienes ventaja en pruebas de Sigilo y +5 pies de movimiento.",
            "capa de protección": "+1 a la CA y a las tiradas de salvación.",
            "anillo de salto": "Te permite lanzar Saltar desde el anillo; solo afecta a quien lo lleva.",
            "guantes veloces cual rayo": "Tienes ventaja en pruebas de Juego de manos y tus ataques desarmados infligen 1d4 de daño de trueno adicional.",
            "jabalina relámpago": "Consulta la descripción de Jabalina del relámpago: https://www.aidedd.org/magic-item/es/jabalina-del-relampago",
            "mejorar u obtener un arma +1": "El Excel no especifica una descripción adicional para esta oferta."
        },
        4: {
            "botas superélficas": "Obtienes ventaja en pruebas de Sigilo y +5 pies de movimiento.",
            "capa de protección": "+1 a la CA y a las tiradas de salvación.",
            "anillo de salto": "Te permite lanzar Saltar desde el anillo; solo afecta a quien lo lleva.",
            "guantes veloces cual rayo": "Tienes ventaja en pruebas de Juego de manos y tus ataques desarmados infligen 1d4 de daño de trueno adicional.",
            "jabalina relámpago": "Consulta la descripción de Jabalina del relámpago: https://www.aidedd.org/magic-item/es/jabalina-del-relampago",
            "mejorar u obtener un arma +1": "El Excel no especifica una descripción adicional para esta oferta."
        },
        5: {
            "arma +1": "El Excel no especifica una descripción para esta oferta.",
            "armadura +1": "El Excel no especifica una descripción para esta oferta.",
            "escudo +1": "El Excel no especifica una descripción para esta oferta.",
            "anillo de protección": "El Excel no especifica una descripción para esta oferta.",
            "manto resistechizos": "Mientras lleves este manto tienes ventaja en las salvaciones contra hechizos.",
            "anillo de evasión": "Tiene 2 cargas. Cuando falles una salvación de Destreza, puedes superarla gastando 1 carga. Se recarga después de 1 nivel."
        },
        6: {
            "arma +1": "El Excel no especifica una descripción para esta oferta.",
            "armadura +1": "El Excel no especifica una descripción para esta oferta.",
            "escudo +1": "El Excel no especifica una descripción para esta oferta.",
            "anillo de protección": "El Excel no especifica una descripción para esta oferta.",
            "manto resistechizos": "Mientras lleves este manto tienes ventaja en las salvaciones contra hechizos.",
            "anillo de evasión": "Tiene 2 cargas. Cuando falles una salvación de Destreza, puedes superarla gastando 1 carga. Se recarga después de 1 nivel."
        },
        7: {
            "arma +1": "El Excel no especifica una descripción para esta oferta.",
            "arma +2": "Puedes entregar un arma +1 para rebajar el precio de su mejora.",
            "armadura +1": "El Excel no especifica una descripción para esta oferta.",
            "amuleto de constitución": "Pon tu Constitución en 19.",
            "anillo de resistencia": "Al comprarlo, eliges un tipo de daño al que te otorga resistencia.",
            "capa de desplazamiento": "Mientras la lleves, las criaturas tienen desventaja en sus tiradas de ataque contra ti. Si recibes daño, esta propiedad deja de funcionar hasta el principio de tu siguiente turno. Queda suprimida mientras tu velocidad sea 0."
        },
        8: {
            "arma +1": "El Excel no especifica una descripción para esta oferta.",
            "arma +2": "Puedes entregar un arma +1 para rebajar el precio de su mejora.",
            "armadura +1": "El Excel no especifica una descripción para esta oferta.",
            "amuleto de constitución": "Pon tu Constitución en 19.",
            "anillo de resistencia": "Al comprarlo, eliges un tipo de daño al que te otorga resistencia.",
            "capa de desplazamiento": "Mientras la lleves, las criaturas tienen desventaja en sus tiradas de ataque contra ti. Si recibes daño, esta propiedad deja de funcionar hasta el principio de tu siguiente turno. Queda suprimida mientras tu velocidad sea 0."
        },
        9: {
            "arma +2": "Puedes entregar un arma +1 para rebajar el precio de su mejora.",
            "armadura +2": "Puedes entregar una armadura +1 para rebajar el precio de su mejora.",
            "armadura +1": "El Excel no especifica una descripción para esta oferta.",
            "amuleto de constitución": "Pon tu Constitución en 19.",
            "+1 extra level": "El Excel no especifica una descripción para esta oferta.",
            "bendición de la torre": "Haces crítico con 18, 19 y 20. Cada turno ganas 1d6+2 puntos de golpe temporales si tienes al menos 1 PG."
        },
        10: {
            "arma +2": "Puedes entregar un arma +1 para rebajar el precio de su mejora.",
            "armadura +2": "Puedes entregar una armadura +1 para rebajar el precio de su mejora.",
            "armadura +1": "El Excel no especifica una descripción para esta oferta.",
            "amuleto de constitución": "Pon tu Constitución en 19.",
            "+1 extra level": "El Excel no especifica una descripción para esta oferta.",
            "bendición de la torre": "Haces crítico con 18, 19 y 20. Cada turno ganas 1d6+2 puntos de golpe temporales si tienes al menos 1 PG."
        }
    };
    const normalizedName = item.name.toLocaleLowerCase("es");
    if (isOffer) return offersByFloor[floor]?.[normalizedName] || "El Excel no especifica una descripción para este objeto.";
    return standardEffects[normalizedName] || "El Excel no especifica una descripción para este objeto.";
}

function makeShopItem(item, floor, isOffer = false) {
    const row = document.createElement("details");
    row.className = "shop-item";
    const summary = document.createElement("summary");
    const name = document.createElement("span");
    name.textContent = item.name;
    const price = document.createElement("strong");
    price.textContent = item.price;
    summary.append(name, price);
    const effect = document.createElement("p");
    effect.className = "shop-item-effect";
    effect.textContent = itemEffectText(item, floor, isOffer);
    row.append(summary, effect);
    return row;
}

function renderEvent() {
    const visible = state.phase === "event" || state.phase === "complete";
    showPanel("event-panel", visible);
    if (!visible) return;
    const record = currentRecord();
    setText("event-floor-number", state.floor);
    const resultCard = document.getElementById("event-result-card");
    const emblemSection = document.getElementById("emblem-section");
    const nextButton = document.getElementById("next-floor");
    const finalizeButton = document.getElementById("finalize-run");
    const complete = document.getElementById("run-complete");
    resultCard.hidden = !record.eventRoll;
    emblemSection.hidden = !(state.floor === 5 && record.eventRoll);
    complete.hidden = state.phase !== "complete";

    if (record.eventRoll) {
        const event = gameData.events[record.eventRoll - 1];
        setText("event-roll-label", `D20: ${record.eventRoll} · ${event.name}`);
        setText("event-result-name", event.name);
        setText("event-result-description", event.description);
        document.getElementById("roll-event").hidden = true;
    } else {
        document.getElementById("roll-event").hidden = false;
        document.getElementById("roll-event").disabled = false;
    }

    if (state.floor === 5 && record.eventRoll) renderEmblemChoices(record);
    const isFinal = state.floor === gameData.config.maxFloors;
    nextButton.hidden = !record.eventRoll || (state.floor === 5 && !record.chosenEmblem) || isFinal || state.phase === "complete";
    finalizeButton.hidden = !record.eventRoll || !isFinal || state.phase === "complete";
    setText("next-floor", `Siguiente piso ${state.floor + 1} →`);
    document.getElementById("roll-event").textContent = "Tirar evento (d20)";
}

function renderEmblemChoices(record) {
    if (!record.emblemOptions) record.emblemOptions = sampleWithoutReplacement(gameData.floors[4].emblems, 3);
    const choices = document.getElementById("emblem-choices");
    choices.replaceChildren();
    setText("selected-emblem", record.chosenEmblem ? `Emblema guardado: ${record.chosenEmblem.name}` : "");
    record.emblemOptions.forEach((emblem) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-card";
        button.setAttribute("aria-pressed", String(record.chosenEmblem?.name === emblem.name));
        const name = document.createElement("strong");
        name.textContent = emblem.name;
        const description = document.createElement("small");
        description.textContent = emblem.description;
        button.append(name, description);
        button.addEventListener("click", () => {
            record.chosenEmblem = emblem;
            if (!state.chosenEmblems.some((saved) => saved.floor === state.floor)) {
                state.chosenEmblems.push({ floor: state.floor, ...emblem });
            } else {
                state.chosenEmblems = state.chosenEmblems.map((saved) => saved.floor === state.floor ? { floor: state.floor, ...emblem } : saved);
            }
            saveState(`Emblema guardado: ${emblem.name}.`);
            render();
        });
        choices.append(button);
    });
}

function render() {
    if (!gameData) return;
    renderDashboard();
    renderEncounter();
    renderRewards();
    renderEvent();
}

function startFloor() {
    const floorData = gameData.floors[state.floor - 1];
    const map = gameData.maps[randomInteger(gameData.maps.length) - 1];
    const mapHasEvent = Math.random() < 0.5;
    const mapEventTableRoll = mapHasEvent ? randomInteger(20) : null;
    const die = floorData.encounters.length;
    const encounterRoll = randomInteger(die);
    state.floors[state.floor] = {
        encounterDie: die,
        encounterRoll,
        encounter: floorData.encounters[encounterRoll - 1],
        map: { ...map },
        mapEventTableRoll,
        mapHasEvent,
        timer: { elapsedMs: 0, startedAt: null },
        classOptions: null,
        chosenClass: null,
        eventRoll: null,
        specialOffers: null,
        finishedAt: null
    };
    state.phase = "encounter";
    saveState(`Piso ${state.floor}: tiradas listas.`);
    render();
}

function toggleTimer() {
    const record = currentRecord();
    if (!record || state.phase !== "encounter") return;
    if (record.timer.startedAt) {
        record.timer.elapsedMs += Date.now() - record.timer.startedAt;
        record.timer.startedAt = null;
        showStatus(`Temporizador pausado en ${formatDuration(record.timer.elapsedMs)}.`);
    } else {
        record.timer.startedAt = Date.now();
        showStatus("Temporizador en marcha.");
    }
    saveState(document.getElementById("save-status").textContent);
    renderDashboard();
}

function finishEncounter() {
    const record = currentRecord();
    if (!record || record.finishedAt) return;
    if (record.timer.startedAt) {
        record.timer.elapsedMs += Date.now() - record.timer.startedAt;
        record.timer.startedAt = null;
    }
    record.finishedAt = new Date().toISOString();
    record.specialOffers = sampleWithoutReplacement(gameData.floors[state.floor - 1].offers, 2);
    state.phase = "rewards";
    saveState(`Piso ${state.floor} completado en ${formatDuration(record.timer.elapsedMs)}.`);
    render();
    document.getElementById("rewards-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function rollClasses() {
    const record = currentRecord();
    const classes = characterLibrary.clases || characterLibrary.classes;
    if (!record || !Array.isArray(classes) || classes.length === 0) {
        showStatus("No se encontraron clases en library.json.", true);
        return;
    }
    record.classOptions = sampleWithoutReplacement(classes, 3);
    record.chosenClass = null;
    state.classHistory.unshift({ floor: state.floor, createdAt: new Date().toISOString(), classes: [...record.classOptions] });
    state.classHistory = state.classHistory.slice(0, CLASS_HISTORY_LIMIT);
    saveState("Sorteo de tres clases guardado en el historial.");
    render();
}

function finishShopping() {
    const record = currentRecord();
    const nextFloor = state.floor + 1;
    if (nextFloor <= gameData.config.maxFloors && nextFloor % 2 === 1 && !record.chosenClass) return;
    state.phase = "event";
    saveState("Compras confirmadas. Ya puedes tirar el evento d20.");
    render();
}

function rollEvent() {
    const record = currentRecord();
    if (!record || record.eventRoll) return;
    record.eventRoll = randomInteger(20);
    saveState(`Evento del piso ${state.floor}: resultado ${record.eventRoll}.`);
    render();
}

function advanceFloor() {
    if (state.floor >= gameData.config.maxFloors) {
        state.phase = "complete";
        saveState("¡Torre completada! Partida guardada.");
        render();
        return;
    }
    state.floor += 1;
    startFloor();
}

function finalizeRun() {
    state.phase = "complete";
    saveState("¡Torre completada! Partida guardada.");
    render();
}

function exportSave() {
    const sanitizedState = sanitizeStateForStorage(state);
    const payload = {
        app: "D&D Rogue Roguelike",
        exportedAt: new Date().toISOString(),
        state: sanitizedState
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `partida-roguelike-piso-${state.floor}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showStatus("Archivo JSON de la partida descargado.");
}

function isValidState(candidate) {
    return candidate && candidate.version === 1
        && Number.isInteger(candidate.floor) && candidate.floor >= 1 && candidate.floor <= gameData.config.maxFloors
        && ["setup", "encounter", "rewards", "event", "complete"].includes(candidate.phase)
        && candidate.floors && typeof candidate.floors === "object";
}

async function importSave(file) {
    if (!file) return;
    try {
        const parsed = JSON.parse(await file.text());
        const candidate = parsed.state || parsed;
        if (!isValidState(candidate)) throw new Error("El archivo no contiene un estado de partida reconocido.");
        state = sanitizeStateForStorage(candidate);
        saveState("Partida cargada y guardada en este navegador.");
        render();
    } catch (error) {
        showStatus(`No se pudo cargar el archivo: ${error.message}`, true);
    }
}

function loadLocalSave() {
    try {
        const stored = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
        if (isValidState(stored)) state = sanitizeStateForStorage(stored);
    } catch {
        state = createInitialState();
    }
}

async function loadData() {
    try {
        const [gameResponse, libraryResponse] = await Promise.all([
            fetch("partida-data.json"),
            fetch("../../library.json")
        ]);
        if (!gameResponse.ok || !libraryResponse.ok) throw new Error("No se pudieron cargar partida-data.json y library.json.");
        gameData = await gameResponse.json();
        characterLibrary = await libraryResponse.json();
        if (gameData.floors.length !== gameData.config.maxFloors || gameData.maps.length !== 10 || gameData.events.length !== 20) {
            throw new Error("La configuración debe contener 10 pisos, 10 mapas y 20 eventos.");
        }
        loadLocalSave();
        render();
        showStatus("Guardado automático activo en este navegador.");
    } catch (error) {
        showStatus(`Error al cargar datos: ${error.message} Abre el proyecto con un servidor local (por ejemplo, Live Server).`, true);
        document.getElementById("roll-floor").disabled = true;
    }
}

document.getElementById("roll-floor").addEventListener("click", startFloor);
document.getElementById("timer-toggle").addEventListener("click", toggleTimer);
document.getElementById("finish-encounter").addEventListener("click", finishEncounter);
document.getElementById("roll-classes").addEventListener("click", rollClasses);
document.getElementById("finish-shopping").addEventListener("click", finishShopping);
document.getElementById("roll-event").addEventListener("click", rollEvent);
document.getElementById("next-floor").addEventListener("click", advanceFloor);
document.getElementById("finalize-run").addEventListener("click", finalizeRun);
document.getElementById("save-game").addEventListener("click", exportSave);
document.getElementById("load-game-button").addEventListener("click", () => document.getElementById("load-game-file").click());
document.getElementById("load-game-file").addEventListener("change", (event) => importSave(event.target.files[0]));
document.getElementById("close-monster-dialog").addEventListener("click", () => document.getElementById("monster-dialog").close());
document.getElementById("monster-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
});
document.getElementById("new-game").addEventListener("click", () => {
    if (!window.confirm("¿Empezar una partida nueva? El estado guardado en este navegador se sustituirá.")) return;
    state = createInitialState();
    saveState("Partida nueva lista.");
    render();
});

window.setInterval(() => {
    const record = currentRecord();
    if (record?.timer?.startedAt) setText("floor-timer", formatDuration(elapsedMilliseconds(record)));
}, 1000);

loadData();
