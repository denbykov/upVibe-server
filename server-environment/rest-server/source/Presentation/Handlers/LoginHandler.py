from .BaseHandler import *

from ..Parsers.UserCredentialsParser import *

from ..Formatters.JWTTokenFormatter import *

from source.Business.Controllers.UserController import *


class LoginHandler(BaseHandler):
    def __init__(self, data_accessor, secret: str):
        super(LoginHandler, self).__init__(data_accessor)
        self.controller = UserController(data_accessor, secret)

    def handle(self, request: HTTPRequest) -> HTTPResponse:
        if request.method == HTTPMethod.POST:
            return self.handle_post(request)

    def handle_post(self, request) -> HTTPResponse:
        credentials = UserCredentialsParser.parse(request.json_payload)
        result = self.controller.login(credentials)

        if isinstance(result, APIError):
            return self.handle_api_error(result)

        return HTTPResponse(HTTPResponseCode.OK, JWTTokenFormatter.format(result))
