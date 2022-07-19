from .AuthorizedHandler import *


class EchoHandler(AuthorizedHandler):
    def authorized_handle(self, request: AuthorizedHTTPRequest) -> HTTPResponse:
        json_payload = {"login": request.user_login}
        return HTTPResponse(HTTPResponseCode.OK, json_payload)
