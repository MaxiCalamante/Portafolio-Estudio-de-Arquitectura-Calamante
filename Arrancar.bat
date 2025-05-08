@echo off
echo ===================================================
echo    Iniciando Estudio Javier Calamante - Sitio Web
echo ===================================================
echo.

:: Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no está instalado o no se encuentra en el PATH.
    echo P instalá Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Verificar si la carpeta node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: No se pudieron instalar las dependencias del frontend.
        pause
        exit /b 1
    )
)

:: Crear carpeta uploads si no existe
if not exist "public\uploads" (
    echo Creando carpeta para uploads...
    mkdir "public\uploads"
)

:: Iniciar el servidor backend en una nueva ventana
echo Iniciando el servidor backend...
start cmd /k "title Backend - Estudio Calamante && node server.js"

:: Esperar un momento para que el backend se inicie
timeout /t 5 /nobreak > nul

:: Iniciar el frontend en modo desarrollo
echo Iniciando el frontend...
start cmd /k "title Frontend - Estudio Calamante && npm run dev"

echo.
echo ===================================================
echo    Aplicación iniciada correctamente
echo    Backend: http://localhost:3000
echo    Frontend: http://localhost:5173
echo ===================================================
echo.
echo Podés cerrar esta ventana. Para detener la aplicación,
echo cerrá las ventanas de comandos del backend y frontend.
echo.
pause
