from source.Business.Entities.File.FileSourceInfo import *


class URLFormatter:
    @staticmethod
    def format(info: FileSourceInfo) -> str:

        if info.source == FileSource.YOUTUBE:
            return URLFormatter.format_yt_url(info)

        raise RuntimeError("Unknown file source")

    @staticmethod
    def format_yt_url(info: FileSourceInfo) -> str:
        return f"https://www.youtube.com/watch?v={info.uid}"
