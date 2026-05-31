window.currentTranslations = {};

/* =========================
   LANGUAGE SYSTEM
========================= */

async function changeLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        window.currentTranslations = await response.json();

        localStorage.setItem('selectedLanguage', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.currentTranslations[key]) {
                el.innerHTML = window.currentTranslations[key];
            }
        });
    } catch (error) {
        console.error("Fehler beim Laden der Sprache:", error);
    }
}

const langSelector = document.getElementById('language-selector');

if (langSelector) {
    langSelector.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}

const savedLanguage = localStorage.getItem('selectedLanguage') || 'de';
changeLanguage(savedLanguage);

if (langSelector) {
    langSelector.value = savedLanguage;
}

/* =========================
   HEADER AUTH
========================= */

function updateHeaderAuth() {
    const userName = localStorage.getItem('userName');
    const navLinksList = document.querySelector('.nav-links');

    if (!navLinksList) return;

    const existing = document.querySelector('.user-dropdown');
    if (existing) existing.remove();

    const li = document.createElement('li');
    li.className = 'user-dropdown';

    if (userName) {
        li.innerHTML = `
            <a href="#" class="dropdown-trigger">
                Hola, ${userName}! <span class="arrow">▼</span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="profile.html">Profil verwalten</a></li>
                <li><a href="#" id="logout-btn">Abmelden</a></li>
            </ul>
        `;
    } else {
        li.innerHTML = `
            <a href="#" class="dropdown-trigger">
                Hola! Anmelden <span class="arrow">▼</span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="login.html">Einloggen</a></li>
                <li><a href="register.html">Registrieren</a></li>
            </ul>
        `;
    }

    navLinksList.appendChild(li);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            location.reload();
        });
    }
}

/* =========================
   TRENDING (INDEX ONLY)
========================= */

async function loadTrendingAccommodations() {
    const grid = document.getElementById('accommodations-grid');
    if (!grid) return;

    try {
        const res = await fetch('http://127.0.0.1:5000/accommodations');
        const data = await res.json();

        if (!data.length) {
            grid.innerHTML = "<p>Momentan keine Angebote verfügbar.</p>";
            return;
        }

        grid.innerHTML = "";

        const lang = localStorage.getItem('selectedLanguage') || 'de';

        data.forEach(acc => {
            const titleKey = lang === 'de' ? 'title' : `title_${lang}`;
            const locKey = lang === 'de' ? 'location_name' : `location_name_${lang}`;

            const title = acc[titleKey] || acc.title;
            const location = acc[locKey] || acc.location_name;

            const card = document.createElement('div');
            card.className = 'acc-card';

            card.innerHTML = `
                <img src="${acc.image_url || 'https://via.placeholder.com/400x250'}">
                <div class="acc-info">
                    <h3>${title}</h3>
                    <p class="acc-location">${location}</p>
                    <p class="acc-price">${acc.price_per_night}€ / Night</p>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Fehler beim Laden:", err);
        grid.innerHTML = "<p>Fehler beim Laden der Daten.</p>";
    }
}

/* =========================
   MAP (OPTIONAL DEBUG)
========================= */

async function loadMapData() {
    try {
        const res = await fetch('http://127.0.0.1:5000/accommodations');
        const data = await res.json();
        console.log("MAP DATA:", data);
    } catch (err) {
        console.error("Map Fehler:", err);
    }
}

/* =========================
   COUNTRY PAGE LOGIC
========================= */

async function initCountryPage() {
    const container = document.getElementById('accommodations-grid');
    const titleEl = document.getElementById('display-country');

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get("country");

    if (!countryCode) return;

    if (titleEl) {
        titleEl.textContent = countryCode.replace(/_/g, ' ');
    }

    try {
        const res = await fetch('http://127.0.0.1:5000/accommodations');
        const data = await res.json();

        console.log("URL Country:", countryCode);
        console.log("Alle Daten:", data);
        const filtered = data.filter(acc => acc.country_code === countryCode);
        console.log("Gefilterte Daten:", filtered);
        
        if (!filtered.length) {
            container.innerHTML = "<p>Keine Unterkünfte verfügbar.</p>";
            return;
        }

        container.innerHTML = "";

        filtered.forEach(acc => {
            const card = document.createElement('div');
            card.className = 'acc-card';

            card.innerHTML = `
                <img src="${acc.image_url}">
                <div class="acc-info">
                    <h3>${acc.title}</h3>
                    <p>${acc.location_name || acc.location_name_en}</p>
                    <p>${acc.price_per_night}€ / Nacht</p>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Country Fehler:", err);
        container.innerHTML = "<p>Fehler beim Laden der Daten.</p>";
    }
}

/* =========================
   GLOBAL INIT (WICHTIG)
========================= */

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
    loadMapData();

    if (window.location.pathname.includes("index")) {
        loadTrendingAccommodations();
    }

    if (window.location.pathname.includes("country")) {
        initCountryPage();
    }
});