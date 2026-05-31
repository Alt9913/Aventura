# Aventura – Digitales Reise-MVP

Aventura ist eine moderne, plattformunabhängige Webanwendung zur Verwaltung und Buchung von exklusiven Reiseunterkünften. Das System wurde als funktionales Minimum Viable Product entwickelt und bietet  eine intuitive Endnutzer-Oberfläche.

## Architekturübersicht (Systemmodell)

Das System basiert auf einer klassischen, lose gekoppelten Drei-Schichten-Architektur (3-Tier-Architecture). Dies garantiert eine saubere Trennung von Design, Logik und Datenhaltung:

* Präsentationsschicht (Frontend): Realisiert mit nativem HTML5, CSS3 (Modern Dark Design) und modularer JavaScript-Logik (main.js, booking.js, profile.js, country.js). Die Auslieferung erfolgt über einen performanten **Nginx-Webserver**.
* Logikschicht (Backend): Ein Python REST-API-Server auf Basis des Flask-Frameworks*(app.py). Das Backend verarbeitet die Client-Anfragen, kapselt die Geschäftslogik (z. B. Authentifizierung mittels JWT/Bcrypt sowie Overlap-Validierung bei Buchungen) und kommuniziert mit der Datenbank.
* Datenschicht (Persistence Layer): Ein MySQL 8.0 Relationales Datenbankmanagementsystem. Speichert persistent Entitäten wie Benutzer (users), Unterkünfte (accommodations) und Buchungsdatensätze (bookings).


## DevOps & Containerisierung

Um das berüchtigte "Works on my machine"-Problem vollständig zu eliminieren und eine nahtlose, plattformunabhängige Portabilität (Mac, Windows, Linux) beim Korrektor zu gewährleisten, ist das gesamte Ökosystem vollständig containerisiert. 

Mittels Docker Compose werden die drei isolierten Container-Dienste vollautomatisch orchestriert, vernetzt und mit den passenden Umgebungsvariablen initialisiert.

---

## Setup- & Startanleitung

### Voraussetzungen
* Installiertes Docker und Docker Desktop (bzw. Docker Compose).
* Hinweis für macOS-Nutzer: Sollte der native AirPlay-Empfänger aktiv sein, blockiert dieser intern Port 5000. Das Docker-Netzwerk leitet die Ports intern jedoch so um, dass Konflikte vermieden werden.

### Ein-Klick-Start
Öffne das Terminal im Hauptverzeichnis des Projekts (wo sich die docker-compose.yml befindet) und starte das System mit folgendem Befehl:

docker-compose up --build



Architekturdiagramm

flowchart LR

    User[Benutzer / Browser]

    subgraph Frontend Container
        NGINX[Nginx Webserver]
        HTML[HTML Seiten]
        JS[JavaScript]
        LANG[Sprachdateien JSON]
    end

    subgraph Backend Container
        Flask[Flask REST API]
        Auth[JWT + BCrypt]
        Logic[Business Logic]
    end

    subgraph Database Container
        MySQL[(MySQL 8.0)]
        Users[users]
        Acc[accommodations]
        Bookings[bookings]
        Countries[countries]
    end

    User -->|HTTP :8000| NGINX

    NGINX --> HTML
    NGINX --> JS
    NGINX --> LANG

    JS -->|REST API :5000| Flask

    Flask --> Auth
    Flask --> Logic

    Logic -->|SQL| MySQL

    MySQL --> Users
    MySQL --> Acc
    MySQL --> Bookings
    MySQL --> Countries