from typing import *


class JWTTokenFormatter:
    @staticmethod
    def format(token: str) -> Dict[str, Any]:
        return {"token": token}
