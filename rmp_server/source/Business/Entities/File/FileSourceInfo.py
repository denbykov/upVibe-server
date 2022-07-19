from .FileSource import *

from dataclasses import dataclass


@dataclass
class FileSourceInfo:
    source: FileSource
    uid: str
