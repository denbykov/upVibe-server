from source.Business.Entities.File.FileState import *

from typing import *


class FileStateFormatter:
    @staticmethod
    def format(state: FileState) -> Dict[str, Any]:
        return {
            "name": state.name.value,
            "description": state.description
        }
