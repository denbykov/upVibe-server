from dataclasses import dataclass
from enum import Enum
from typing import *


class HTTPMethod(Enum):
    GET = 1
    POST = 2
    PUT = 3

    def __eq__(self, other) -> bool:
        return self.value == other.value and self.name == other.name


@dataclass
class HTTPRequest:
    path: str
    method: HTTPMethod
    authorization_header: str
    json_payload: Dict[str, Any]
