from .BaseHandler import *

from ..Parsers.UserCredentialsParser import *

from source.Business.Controllers.UserController import *


class UserHandler(BaseHandler):
    def __init__(self, data_accessor, secret: str):
        super(UserHandler, self).__init__(data_accessor)
        self.controller = UserController(data_accessor, secret)

    def handle(self, request: HTTPRequest) -> HTTPResponse:
        if request.method == HTTPMethod.POST:
            return self.handle_post(request)

    def handle_post(self, request) -> HTTPResponse:
        credentials = UserCredentialsParser.parse(request.json_payload)
        error = self.controller.create_user(credentials)
        if error:
            return self.handle_api_error(error)
        return HTTPResponse(HTTPResponseCode.OK, None)
