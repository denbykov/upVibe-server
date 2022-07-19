from source.Business.Controllers.FileManagement.IDownloadingManager import *


class DownloadingManagerMock(IDownloadingManager):
    def run(self) -> None:
        pass

    def enqueue_file(self, file: File, info: FileSourceInfo):
        pass

    def get_progress(self, file: File) -> Optional[DownloadingProgress]:
        pass
