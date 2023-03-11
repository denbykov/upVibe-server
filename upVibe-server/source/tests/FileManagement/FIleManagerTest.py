import unittest
from unittest.mock import *

from source.tests.DataAccessorMock import *
from .DownloadingManagerMock import *

from source.Data.utils import *

from source.Business.Controllers.FileManagement.FileManager import FileManager
from source.Business.Parsers.URLParser import *

raw_file_1 = File(
    id=None,
    url="https://www.youtube.com/watch?v=4a8CogWA3-Y&",
    path=None,
    state=None)

prefilled_file_1 = File(
    id=None,
    url="https://www.youtube.com/watch?v=4a8CogWA3-Y&",
    path=Path("storage\\audio\\yt_4a8ccogwwaa3-yy.mp3"),
    state=FileState(FileStateName.PENDING, ""))

pending_file_1 = File(
    id=1,
    url="https://www.youtube.com/watch?v=4a8CogWA3-Y&",
    path=Path("storage\\audio\\yt_4a8ccogwwaa3-yy.mp3"),
    state=FileState(FileStateName.PENDING, ""))

pending_file_2 = File(
    id=2,
    url="https://www.youtube.com/watch?v=4a8CogWA3-C&",
    path=Path("storage\\audio\\yt_4a8ccogwwaa3-cc.mp3"),
    state=FileState(FileStateName.PENDING, ""))

file_states = {
    FileStateName.ERROR: 1,
    FileStateName.PENDING: 2,
    FileStateName.READY: 3}


class FileManagerTest(unittest.TestCase):
    def setUp(self):
        self.data_accessor = DataAccessorMock()
        self.file_manager = FileManager(self.data_accessor)
        FileManager.downloading_manager = DownloadingManagerMock()
        FileManager.db_states_id_mapping = file_states
        FileManager.file_dir = Path("storage")

    def test_init(self):
        self.data_accessor.get_file_states = \
            create_autospec(
                self.data_accessor.get_file_states,
                return_value=make_da_response(
                    result=file_states))

        self.data_accessor.get_files_by_state = \
            create_autospec(
                self.data_accessor.get_files_by_state,
                return_value=make_da_response(result=[
                    pending_file_1,
                    pending_file_2]))

        FileManager.downloading_manager.run = \
            create_autospec(
                FileManager.downloading_manager.run,
                return_value=None)

        FileManager.downloading_manager.enqueue_file = \
            create_autospec(
                FileManager.downloading_manager.enqueue_file,
                return_value=None)

        FileManager.db_states_id_mapping = None
        FileManager.file_dir = None

        file_dir: Path = Path("storage")

        self.file_manager.init(self.data_accessor, file_dir)

        self.data_accessor.get_file_states.assert_called_once()
        self.data_accessor.get_files_by_state.assert_called_once_with(
            (FileStateName.PENDING,))
        FileManager.downloading_manager.run.assert_called_once()
        FileManager.downloading_manager.enqueue_file.assert_has_calls(
            [
                call(pending_file_1, URLParser.parse(pending_file_1.url)),
                call(pending_file_2, URLParser.parse(pending_file_2.url))
            ])

        self.assertEqual(self.file_manager.db_states_id_mapping, file_states)
        self.assertEqual(self.file_manager.file_dir, file_dir)

    def test_download_file(self):
        self.data_accessor.add_file = \
            create_autospec(
                self.data_accessor.add_file,
                return_value=make_da_response(
                    result=pending_file_1))

        FileManager.downloading_manager.enqueue_file = \
            create_autospec(
                FileManager.downloading_manager.enqueue_file,
                return_value=None)

        error, file = self.file_manager.download_file(raw_file_1)

        self.data_accessor.add_file.assert_called_once_with(
            prefilled_file_1, FileManager.db_states_id_mapping[FileStateName.PENDING])
        FileManager.downloading_manager.enqueue_file.assert_called_once_with(
            pending_file_1, URLParser.parse(pending_file_1.url))

        self.assertEqual(file, pending_file_1)
        self.assertEqual(bool(error), False)
