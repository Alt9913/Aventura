async function loadProfilePage() {
    // 1. Eingeloggten User aus dem Speicher holen (wie in main.js/booking.js)
    const loggedInUser = localStorage.getItem('userName') || sessionStorage.getItem('userName');
    const usernameElement = document.getElementById('profile-username');
    const container = document.getElementById('bookings-container');

    if (!loggedInUser) {
        if (usernameElement) usernameElement.innerText = "Gast";
        container.innerHTML = `<p style="color: #ff9800;">Sie müssen eingeloggt sein, um Ihr Profil zu sehen. <a href="login.html" style="color: white; text-decoration: underline;">Jetzt einloggen</a></p>`;
        return;
    }

    // Namen im Header anzeigen
    if (usernameElement) usernameElement.innerText = loggedInUser;

    const lang = localStorage.getItem('selectedLanguage') || 'de';

    try {
        // 2. Buchungen vom Server abfragen
        const response = await fetch(`http://127.0.0.1:5000/my-bookings?user=${loggedInUser}`);
        if (!response.ok) throw new Error("Fehler beim Abrufen der Buchungen.");

        const bookings = await response.json();

        if (bookings.length === 0) {
            container.innerHTML = `<p style="color: #888;"><i class="fas fa-info-circle"></i> Du hast noch keine Abenteuer gebucht. Geh auf Entdeckungstour!</p>`;
            return;
        }

        container.innerHTML = ''; // Lade-Text entfernen

        // 3. Buchungskarten generieren
        bookings.forEach(book => {
            // Dynamische Sprach-Keys
            const titleKey = lang === 'de' ? 'title' : `title_${lang}`;
            const locKey = lang === 'de' ? 'location_name' : `location_name_${lang}`;

            const displayTitle = book[titleKey] || book.title;
            const displayLoc = book[locKey] || book.location_name;

            // Datum für die Anzeige schick formatieren (YYYY-MM-DD zu DD.MM.YYYY)
            const formatDate = (dateStr) => {
                const [year, month, day] = dateStr.split('-');
                return `${day}.${month}.${year}`;
            };

            const card = document.createElement('div');
            card.className = 'booking-list-card';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="${book.image_url || 'https://via.placeholder.com/150'}" alt="${displayTitle}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 8px;">
                    <div class="booking-details-text">
                        <h3>${displayTitle}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${displayLoc}</p>
                        <p style="margin-top: 5px; color: #ff9800; font-weight: bold;">${book.price_per_night}€ <span style="font-weight: normal; color: #666;">/ Nacht</span></p>
                    </div>
                </div>
                <div class="booking-date-badge">
                    <i class="far fa-calendar-alt"></i> ${formatDate(book.start_date)} - ${formatDate(book.end_date)}
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Fehler im Profil-JS:", error);
        container.innerHTML = `<p style="color: red;">Fehler beim Laden deiner Buchungen.</p>`;
    }
}

// Initialisieren
document.addEventListener('DOMContentLoaded', loadProfilePage);