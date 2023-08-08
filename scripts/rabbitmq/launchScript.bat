@ECHO OFF

ECHO "Launching scripts..."
ECHO "Please, enter select a script to run"
ECHO "1. Create docker network"
ECHO "2. Lunch docker-compose"
ECHO "3. Exit"

SET /P M=Type 1, 2 or 3 then press ENTER:

IF %M%==1 GOTO :NETWORK
IF %M%==2 GOTO :RABBITMQ
IF %M%==3 GOTO :EXIT

:NETWORK
ECHO "Creating docker network..."
docker network create -d bridge up-vibe-network
GOTO :END

:RABBITMQ
ECHO "Launching docker-compose-postgresql..."
docker compose -f .\docker-compose.yml -p rabbitmq up -d
GOTO :END


:EXIT
ECHO "Exiting..."
GOTO :END

:END
