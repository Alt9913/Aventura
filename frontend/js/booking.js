
let pricePerNight = 0;
async function loadBookingPage() {
   
    const urlParams = new URLSearchParams(window.location.search);
    const accId = urlParams.get('id');

    if (!accId) {
        document.getElementById('booking-title').innerText = "Keine Unterkunft ausgewählt.";
        return;
    }

   
    const lang = localStorage.getItem('selectedLanguage') || 'de';

    try {
        
        const response = await fetch(`http://127.0.0.1:5000/accommodation/${accId}`);
        
        if (!response.ok) {
            throw new Error("Unterkunft konnte nicht geladen werden.");
        }
        
        const acc = await response.json();
        pricePerNight = parseFloat(acc.price_per_night);
         document.getElementById('booking-price').innerHTML = `${acc.price_per_night}€ ...`;
        
        const titleKey = lang === 'de' ? 'title' : `title_${lang}`;
        const locKey = lang === 'de' ? 'location_name' : `location_name_${lang}`;

        const displayTitle = acc[titleKey] || acc.title;
        const displayLoc = acc[locKey] || acc.location_name;

        
        document.getElementById('booking-image').src = acc.image_url || 'https://via.placeholder.com/800x450';
        document.getElementById('booking-image').alt = displayTitle;
        document.getElementById('booking-title').innerText = displayTitle;
        document.getElementById('booking-location').innerText = displayLoc;
        document.getElementById('booking-price').innerHTML = `${acc.price_per_night}€ <span style="font-size: 0.9rem; color: #888; font-weight: normal;">/ Nacht</span>`;

    } catch (error) {
        console.error("Fehler:", error);
        document.getElementById('booking-title').innerText = "Fehler beim Laden der Daten.";
    }
    
}

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const statusField = document.getElementById('booking-status');
    
    
    const loggedInUserId = localStorage.getItem('userName') || sessionStorage.getItem('userName');

    if (!loggedInUserId) {
        statusField.style.color = '#ff9800';
        statusField.innerHTML = 'Sie müssen eingeloggt sein, um zu buchen! <a href="login.html" style="color: white; text-decoration: underline;">Jetzt einloggen / Registrieren</a>';
        return;
    }

    
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    
    if (new Date(startDate) >= new Date(endDate)) {
        statusField.style.color = '#ff3333';
        statusField.innerText = 'Das Abreisedatum muss nach dem Anreisedatum liegen.';
        return;
    }

    
    const urlParams = new URLSearchParams(window.location.search);
    const accId = urlParams.get('id');

    
    const bookingData = {
        user_id: loggedInUserId,
        accommodation_id: accId,
        start_date: startDate,
        end_date: endDate
    };

    console.log("Sende Buchungsdaten ans Backend:", bookingData);
    
    
    statusField.style.color = '#888';
    statusField.innerText = 'Verarbeite Buchung...';

    try {
        const response = await fetch('http://127.0.0.1:5000/create-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            statusField.style.color = '#2ecc71'; 
            statusField.innerText = '✓ ' + result.message;
            
            
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 3000);
        } else {
            statusField.style.color = '#ff3333';
            statusField.innerText = 'Fehler: ' + result.message;
        }

    } catch (error) {
        console.error("Fehler beim Senden der Buchung:", error);
        statusField.style.color = '#ff3333';
        statusField.innerText = 'Netzwerkfehler: Die Buchung konnte nicht verarbeitet werden.';
    }
});

function updateLivePrice() {
    const startDateVal = document.getElementById('start-date').value;
    const endDateVal = document.getElementById('end-date').value;
    const summaryBox = document.getElementById('booking-summary');
    const calcField = document.getElementById('price-calculation');
    const totalField = document.getElementById('price-total');

    if (!startDateVal || !endDateVal || pricePerNight === 0) {
        if (summaryBox) summaryBox.style.display = 'none';
        return;
    }

    const start = new Date(startDateVal);
    const end = new Date(endDateVal);
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights > 0) {
        const totalPrice = nights * pricePerNight;

       
        calcField.innerText = `${nights} ${nights === 1 ? 'Nacht' : 'Nächte'} x ${pricePerNight.toFixed(2)}€`;
        totalField.innerText = `${totalPrice.toFixed(2)}€ Gesamt`;
        
        summaryBox.style.display = 'block';
    } else {
        summaryBox.style.display = 'none';
    }
}

// EVENT LISTENER FÜR BUCHUNG & FORMULAR 
document.addEventListener('DOMContentLoaded', () => {
    
    loadBookingPage();

    
    const startInput = document.getElementById('start-date');
    const endInput = document.getElementById('end-date');

    if (startInput && endInput) {
        startInput.addEventListener('input', updateLivePrice);
        endInput.addEventListener('input', updateLivePrice);
    }
});
;