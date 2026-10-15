let library;

function getHistoryKey() {
    return library.configuracion.claveHistorial;
}

function chooseRandomOptions(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, Math.min(library.configuracion.opcionesPorCategoria, shuffled.length));
}

function readHistory() {
    try {
        const history = JSON.parse(localStorage.getItem(getHistoryKey()) || "[]");
        return Array.isArray(history) ? history.slice(0, library.configuracion.maximoHistorial) : [];
    } catch {
        return [];
    }
}

function renderOptions(elementId, options) {
    const list = document.getElementById(elementId);
    list.replaceChildren(...options.map((option) => {
        const item = document.createElement("li");
        item.textContent = option;
        return item;
    }));
}

function formatTimestamp(timestamp) {
    return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
}

function renderHistory() {
    const history = readHistory();
    const list = document.getElementById("history-list");
    const emptyMessage = document.getElementById("empty-history");
    list.replaceChildren();
    emptyMessage.hidden = history.length > 0;

    history.forEach((roll) => {
        const entry = document.createElement("li");
        entry.className = "history-entry";
        const time = document.createElement("time");
        time.dateTime = roll.createdAt;
        time.textContent = formatTimestamp(roll.createdAt);
        const groups = document.createElement("div");
        groups.className = "history-groups";

        [["CLASES", roll.classes], ["RAZAS", roll.races], ["TRASFONDOS", roll.backgrounds]].forEach(([label, values]) => {
            const group = document.createElement("div");
            const heading = document.createElement("strong");
            heading.textContent = label;
            group.append(heading, document.createTextNode(Array.isArray(values) ? values.join(" · ") : ""));
            groups.append(group);
        });

        entry.append(time, groups);
        list.append(entry);
    });
}

function generateOptions() {
    const roll = {
        createdAt: new Date().toISOString(),
        classes: chooseRandomOptions(library.clases),
        races: chooseRandomOptions(library.razas),
        backgrounds: chooseRandomOptions(library.trasfondos)
    };

    renderOptions("class-options", roll.classes);
    renderOptions("race-options", roll.races);
    renderOptions("background-options", roll.backgrounds);

    const history = [roll, ...readHistory()].slice(0, library.configuracion.maximoHistorial);
    try {
        localStorage.setItem(getHistoryKey(), JSON.stringify(history));
    } catch {
        // El generador sigue funcionando si el navegador bloquea el almacenamiento local.
    }
    renderHistory();
}

document.getElementById("generate-button").addEventListener("click", generateOptions);
document.getElementById("history-button").addEventListener("click", (event) => {
    const panel = document.getElementById("history-panel");
    const isOpening = panel.hidden;
    panel.hidden = !isOpening;
    event.currentTarget.setAttribute("aria-expanded", String(isOpening));
    event.currentTarget.querySelector("span").textContent = isOpening ? "▴" : "▾";
    if (isOpening) {
        renderHistory();
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
});
document.getElementById("clear-history").addEventListener("click", () => {
    try {
        localStorage.removeItem(getHistoryKey());
    } catch {
        // El historial puede no estar disponible en modo privado o restringido.
    }
    renderHistory();
});

async function loadLibrary() {
    const generateButton = document.getElementById("generate-button");
    const status = document.getElementById("library-status");
    generateButton.disabled = true;
    status.textContent = "Cargando configuración…";

    try {
        const response = await fetch("../../library.json");
        if (!response.ok) {
            throw new Error(`No se pudo cargar library.json (${response.status}).`);
        }

        const loadedLibrary = await response.json();
        const config = loadedLibrary.configuracion;
        const validCatalogs = [loadedLibrary.clases, loadedLibrary.razas, loadedLibrary.trasfondos]
            .every((catalog) => Array.isArray(catalog) && catalog.length > 0);
        const validConfig = config
            && Number.isInteger(config.opcionesPorCategoria) && config.opcionesPorCategoria > 0
            && Number.isInteger(config.maximoHistorial) && config.maximoHistorial > 0
            && Number.isFinite(config.piezasDeOroIniciales) && config.piezasDeOroIniciales >= 0
            && typeof config.claveHistorial === "string" && config.claveHistorial.length > 0;

        if (!validCatalogs || !validConfig) {
            throw new Error("Revisa la estructura y los valores de library.json.");
        }

        library = loadedLibrary;
        document.getElementById("starting-gold").textContent = `${config.piezasDeOroIniciales} PO`;
        document.getElementById("option-count-description").textContent = `Genera ${config.opcionesPorCategoria} opciones al azar para cada categoría, tomadas de los catálogos oficiales del Manual del jugador de 2014.`;
        document.querySelector(".site-footer").textContent = `Las opciones se guardan en este navegador · D&D 5e (2014) · Historial: ${config.maximoHistorial} tiradas`;
        generateButton.disabled = false;
        status.textContent = "Configuración lista. Puedes editar los catálogos y valores en library.json.";
        renderHistory();
    } catch (error) {
        status.textContent = `No se pudo cargar library.json. Abre el proyecto mediante un servidor local (por ejemplo, Live Server) y comprueba que library.json esté en la carpeta raíz del proyecto. ${error.message}`;
    }
}

loadLibrary();
