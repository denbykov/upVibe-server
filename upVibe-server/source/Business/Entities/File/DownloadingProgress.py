from dataclasses import dataclass

from .FileState import FileStateName


@dataclass
class DownloadingProgress:
    percent: int
    speed: int
    state: FileStateName
