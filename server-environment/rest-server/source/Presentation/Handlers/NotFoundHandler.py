from .BaseHandler import *


class NotFoundHandler(BaseHandler):
    def __init__(self, data_accessor):
        super(NotFoundHandler, self).__init__(data_accessor)

    def handle(self, request: HTTPRequest) -> HTTPResponse:
        return self.handle_api_error(
            APIError(ErrorCodes.NO_SUCH_RESOURCE, "Not found"))
