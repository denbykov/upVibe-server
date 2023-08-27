@ECHO OFF

ECHO "Launching scripts..."
ECHO "Please, enter select a script to run"
ECHO "1. docker-compose build server"
ECHO "2. docker-compose up server"
ECHO "3. Exit"

SET /P M=Type number and then press ENTER:

IF %M%==1 GOTO :BUILD
IF %M%==2 GOTO :UP
IF %M%==3 GOTO :EXIT

:BUILD
ECHO "Launching docker-compose... build"
docker-compose -f .\docker-compose.dev.yml -p dev-app build --no-cache
GOTO :END

:UP
ECHO "Launching docker-compose... up"
docker compose -f .\docker-compose.dev.yml -p dev-app up -d
GOTO :END

:EXIT
ECHO "Exiting..."
GOTO :END

:END
