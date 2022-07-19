from source.Business.Entities.File.File import *

from typing import *

from .FileStateFormatter import *


class FileFormatter:
    @staticmethod
    def format(file: File) -> Dict[str, Any]:
        return {
            "id": file.id,
            "url": file.url,
            "state": FileStateFormatter.format(file.state)
        }

