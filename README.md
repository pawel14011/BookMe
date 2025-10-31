### Krok 1: Klonowanie repozytorium

git clone <url-repozytorium>

cd room-booking-system

### Krok 2: Instalacja backendu

cd server

npm install

### Krok 3: Konfiguracja bazy danych

1. Utwórz bazę danych MySQL:

CREATE DATABASE room_booking_db;

### Krok 4: Uruchomienie backendu

Pamietaj dostosuj plik .env.

npm run dev

### Krok 5: Instalacja frontendu

cd ../client

npm install

npm run dev

Zaloguj się jako admin:

Email: admin@system.pl

Hasło: admin123

Lub jako noramalny pracownik.

Ogólnie domyślnie są wypełniane dane wiec możesz to wyłączyć w lokalizacji /server/models/index.js/

Komentując 43/44/45 linijki
