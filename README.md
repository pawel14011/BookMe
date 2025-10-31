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



## Tutaj funkcje do sprawdzenia:

### Użytkownik

#### Zarządzanie Rezerwacjami
- Rezerwowanie sal w wybranym terminie
- Odwoływanie własnych rezerwacji
- Zmiana terminu istniejącej rezerwacji
- Przeglądanie historii własnych rezerwacji

#### Przeglądanie Sal
- Przeglądanie dostępnych sal
- Sprawdzanie dostępnych terminów dla wybranej sali
- Wyszukiwanie wolnych terminów konkretnej sali
- Filtrowanie sal według kryteriów

#### Konto
- Rejestracja nowego konta
- Logowanie do systemu
- Edycja danych profilu
- Usuwanie konta

### Administrator

#### Zarządzanie Salami
- Dodawanie nowych sal
- Usuwanie sal
- Zmiana nazwy sal
- Dodawanie i zarządzanie typami sal

#### Zarządzanie Rezerwacjami
- Przeglądanie wszystkich rezerwacji użytkowników
- Anulowanie rezerwacji użytkowników
- Usuwanie rezerwacji
- Pełna kontrola nad systemem rezerwacji

