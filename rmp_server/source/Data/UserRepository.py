import sqlite3

from source.Business.Entities.UserCredentials import *

import logging
import source.LoggerNames as LoggerNames

from .utils import *


class UserRepository:
    def __init__(self):
        self.logger: logging.Logger = logging.getLogger(LoggerNames.DATA)

    def get_password(self, login, con: sqlite3.Connection) -> Tuple[DataError, str]:
        try:
            with con:
                rows = con.execute(
                    "select password from User where login = (?)",
                    (login,)).fetchall()
                if rows:
                    return make_da_response(result=rows[0][0])
                else:
                    return make_da_response(error=ErrorCodes.NO_SUCH_RESOURCE)
        except sqlite3.OperationalError as ex:
            self.logger.error(ex)
            return make_da_response(error=ErrorCodes.UNKNOWN_ERROR)

    def add_user(self, credentials: UserCredentials, con: sqlite3.Connection) -> Tuple[DataError, None]:
        try:
            with con:
                con.execute(
                    "insert into User(login,password) values ((?),(?))",
                    (credentials.login, credentials.password))
                con.commit()
                return make_da_response(result=None)
        except sqlite3.IntegrityError as ex:
            return make_da_response(error=ErrorCodes.RESOURCE_ALREADY_EXISTS)
        except sqlite3.OperationalError as ex:
            self.logger.error(ex)
            return make_da_response(error=ErrorCodes.UNKNOWN_ERROR)
