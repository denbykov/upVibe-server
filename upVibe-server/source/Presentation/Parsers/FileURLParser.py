from typing import *


class FileURLParser:
    @staticmethod
    def parse(data: Dict[str, Any]) -> str:
        return data["url"]
