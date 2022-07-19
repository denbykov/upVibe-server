from dataclasses import dataclass
from enum import Enum
from typing import *


class HTTPResponseCode(Enum):
    OK = 200
    BAD_REQUEST = 400
    INTERNAL_ERROR = 500


@dataclass
class HTTPResponse:
    response_code: HTTPResponseCode
    json_payload: Optional[Dict[str, Any]]
