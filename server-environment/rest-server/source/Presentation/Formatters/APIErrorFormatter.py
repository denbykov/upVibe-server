from source.Business.Entities.APIError import *
from typing import *


class APIErrorFormatter:
    @staticmethod
    def format(error: APIError) -> Dict[str, Any]:
        return {"code": error.code.value, "msg": error.msg}
