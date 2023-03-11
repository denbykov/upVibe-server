import typing

from source.Business.Entities.UserCredentials import *
from source.Business.Entities.APIError import *

from ..IDataAccessor import *

from hashlib import sha256

import jwt


class UserController:
    JWT_ALGORITHM = "HS256"

    def __init__(self, data_accessor: IDataAccessor, secret: str):
        self.data_accessor = data_accessor
        self.secret = secret

    def create_user(self, credentials: UserCredentials) -> Optional[APIError]:
        credentials.password = sha256(credentials.password.encode()).hexdigest()
        error, unused = self.data_accessor.add_user(credentials)

        if error and error.code == ErrorCodes.RESOURCE_ALREADY_EXISTS:
            return APIError(error.code, "User already exists")
        if error and error.code == ErrorCodes.UNKNOWN_ERROR:
            return APIError(error.code, "Unknown error")

        return None

    def login(self, credentials: UserCredentials) -> Union[APIError, str]:
        credentials.password = sha256(credentials.password.encode()).hexdigest()
        error, password = self.data_accessor.get_password(credentials.login)

        if error and error.code == ErrorCodes.NO_SUCH_RESOURCE:
            return APIError(error.code, "Wrong login or password")
        if error and error.code == ErrorCodes.UNKNOWN_ERROR:
            return APIError(error.code, "Unknown error")

        if password != credentials.password:
            return APIError(ErrorCodes.NO_SUCH_RESOURCE, "Wrong login or password")

        jwt_payload = {"login": credentials.login}

        return jwt.encode(jwt_payload, self.secret, algorithm=self.JWT_ALGORITHM)

    def verify_token(self, token: str) -> str:
        return jwt.decode(token, self.secret, algorithms=self.JWT_ALGORITHM)["login"]
