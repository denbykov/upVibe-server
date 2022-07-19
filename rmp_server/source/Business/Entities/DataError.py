from dataclasses import dataclass

from .APIError import ErrorCodes


@dataclass
class DataError:
    error: bool
    code: ErrorCodes

    def __init__(self, is_error: bool, code: ErrorCodes):
        self.error = is_error
        self.code = code

    def __bool__(self):
        return self.error

    def is_error(self) -> bool:
        return self.error
