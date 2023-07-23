@ECHO OFF

ECHO "Launching scripts..."
ECHO "Please, enter select a script to run"
ECHO "1. Build docker-compose.dev"
ECHO "2. Exit"

SET /P M=Type 1 or 2 then press ENTER:

IF %M%==1 GOTO :BUILD
IF %M%==3 GOTO :EXIT

:BUILD
ECHO "Launching docker-compose..."
docker compose -f .\docker-compose.dev.yml -p dev-app up

:EXIT
ECHO "Exiting..."
GOTO :END

:END