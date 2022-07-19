from typing import *

from source.Business.Entities.DataError import *


def make_da_response(error: ErrorCodes = None, result: Any = None) -> Tuple[DataError, Any]:
    if error:
        return DataError(True, error), result
    return DataError(False, ErrorCodes.UNKNOWN_ERROR), result


class QueryList:
    def __init__(self, qlist: Iterable, extractor: Callable = None):
        self.qlist = qlist
        self.extractor = extractor

    def resolve(self) -> str:
        result = "("

        for el in self.qlist[0:-1]:
            if self.extractor is None:
                result += f"\'{el}\'"
            else:
                result += f"\'{self.extractor(el)}\'"
            result += ","

        el = self.qlist[-1]

        if self.extractor is None:
            result += f"\'{el}\'"
        else:
            result += f"\'{self.extractor(el)}\'"

        result += ")"

        return result
