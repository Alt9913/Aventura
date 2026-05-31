async function loadCountryPage() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const countryParam = urlParams.get('country');

    console.log("Erkannter Ländername aus URL:", countryParam);

    if (!countryParam) {
        document.getElementById('country-title').innerText = "Kein Land ausgewählt";
        return;
    }

    const lang = localStorage.getItem('selectedLanguage') || 'de';

    
    let displayCountryName = countryParam;
    if (typeof translations !== 'undefined' && translations[countryParam]) {
        displayCountryName = translations[countryParam];
    }
    
    document.getElementById('country-title').innerText = displayCountryName;

    
    const grid = document.getElementById('country-accommodations-grid');
    if (!grid) return;
    
    try {
       const infoResponse = await fetch(`http://127.0.0.1:5000/country-info?country=${countryParam}`);
        if (infoResponse.ok) {
            const countryData = await infoResponse.json();
            
            
            const nameKey = lang === 'de' ? 'name_de' : `name_${lang}`;
            const textKey = lang === 'de' ? 'info_text_de' : `info_text_${lang}`;

            
            document.getElementById('country-title').innerText = countryData[nameKey] || countryData.name_de;
            document.getElementById('country-info-text').innerText = countryData[textKey] || countryData.info_text_de;
            
            
            const flagImg = document.getElementById('country-flag');
            if (countryData.flag_url) {
                flagImg.src = countryData.flag_url;
                flagImg.style.display = 'inline-block';
            }

            
            document.getElementById('info-badge-1').innerText = countryData.additional_info_1_en || '';
            document.getElementById('info-badge-2').innerText = countryData.additional_info_2_en || '';
        }
        const response = await fetch(`http://127.0.0.1:5000/accommodations?country=${countryParam}`);
        const data = await response.json();

        console.log("Daten erhalten:", data);

        if (data.length === 0) {
            grid.innerHTML = `<p style="color: #888; text-align: center; width: 100%; grid-column: 1/-1;">
                Momentan keine exklusiven Villen in dieser Region verfügbar.
            </p>`;
            return;
        }

        grid.innerHTML = ''; 

        data.forEach(acc => {
            const card = document.createElement('div');
            card.className = 'acc-card';
            card.style.cursor = 'pointer';
            card.onclick = () => {
                window.location.href = `booking.html?id=${acc.id}`;
            };

            const titleKey = lang === 'de' ? 'title' : `title_${lang}`;
            const locKey = lang === 'de' ? 'location_name' : `location_name_${lang}`;

            const displayTitle = acc[titleKey] || acc.title;
            const displayLoc = acc[locKey] || acc.location_name;

            card.innerHTML = `
                <img src="${acc.image_url || 'https://via.placeholder.com/400x250'}" alt="${displayTitle}">
                <div class="acc-info">
                    <h3>${displayTitle}</h3>
                    <p class="acc-location">${displayLoc}</p>
                    <p class="acc-price">${acc.price_per_night}€ <span>/ Nacht</span></p>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Fehler beim Laden:", error);
        grid.innerHTML = "<p style='color: red;'>Fehler beim Laden der Unterkünfte.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadCountryPage);