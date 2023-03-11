from .FileState import *

from dataclasses import dataclass

from pathlib import Path


@dataclass
class File:
    id: int
    url: str
    state: FileState
    path: Path
