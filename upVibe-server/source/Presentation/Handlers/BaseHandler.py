from source.Core.HTTPHandlerAdapter import IHTTPRequestHandler
from source.Core.HTTPRequest import *
from source.Core.HTTPResponse import *

from source.Business.IDataAccessor import *

from ..Formatters.APIErrorFormatter import *


class BaseHandler(IHTTPRequestHandler):
    def __init__(self, data_accessor):
        self.data_accessor = data_accessor

    @abstractmethod
    def handle(self, request: HTTPRequest) -> HTTPResponse:
        pass

    @staticmethod
    def handle_api_error(error) -> HTTPResponse:
        return HTTPResponse(
            HTTPResponseCode.BAD_REQUEST,
            APIErrorFormatter.format(error))
