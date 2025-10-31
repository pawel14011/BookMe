@echo off
REM Tworzenie głównego katalogu


REM Tworzenie src
mkdir src
cd src

REM Tworzenie podkatalogów
mkdir components
mkdir pages
mkdir services
mkdir context
mkdir utils

REM Tworzenie plików w components
echo. > components\Navbar.jsx
echo. > components\LoginForm.jsx
echo. > components\RegisterForm.jsx
echo. > components\Layout.jsx

REM Tworzenie plików w pages
echo. > pages\LoginPage.jsx
echo. > pages\DashboardPage.jsx
echo. > pages\NotFoundPage.jsx

REM Tworzenie plików w services
echo. > services\api.js

REM Tworzenie plików w context
echo. > context\AuthContext.jsx

REM Tworzenie plików w utils
echo. > utils\storage.js

REM Tworzenie plików głównych w src
echo. > App.jsx
echo. > App.css
echo. > index.css
echo. > main.jsx

echo.
echo Struktura folderow i plikow klienta zostala pomyslnie utworzona!
pause
