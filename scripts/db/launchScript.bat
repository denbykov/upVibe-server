@ECHO OFF

ECHO "Launching scripts..."
ECHO "Please, enter select a script to run"
ECHO "1. Create docker network"
ECHO "2. Lunch docker-compose-postgresql"
ECHO "3. Lunch docker-compose-liquibase"
ECHO "4. Exit"

SET /P M=Type 1, 2 or 3 then press ENTER:

IF %M%==1 GOTO :NETWORK
IF %M%==2 GOTO :POSTGRESQL
IF %M%==3 GOTO :LIQUIBASE
IF %M%==4 GOTO :EXIT

:NETWORK
ECHO "Creating docker network..."
docker network create -d bridge up-vibe-network
GOTO :END

:POSTGRESQL
ECHO "Launching docker-compose-postgresql..."
docker compose -f .\docker-compose-postgresql.yml -p postgresql up -d
GOTO :END

:LIQUIBASE
ECHO "Launching docker-compose-liquibase..."
docker compose -f .\docker-compose-liquibase.yml -p liquibase up
GOTO :END

:EXIT
ECHO "Exiting..."
GOTO :END

:END
