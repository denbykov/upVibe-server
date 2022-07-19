from source.Business.Entities.UserCredentials import *
from typing import *


class UserCredentialsParser:
    @staticmethod
    def parse(data: Dict[str, Any]) -> UserCredentials:
        return UserCredentials(data["login"], data["password"])
