from .BaseHandler import *

from source.Business.Controllers.UserController import *


@dataclass
class AuthorizedHTTPRequest:
    path: str
    method: HTTPMethod
    json_payload: Dict[str, Any]
    user_login: str


class AuthorizedHandler(BaseHandler):
    def __init__(self, data_accessor, secret: str):
        super(AuthorizedHandler, self).__init__(data_accessor)
        self.authorization_controller = UserController(data_accessor, secret)

    def handle(self, request: HTTPRequest) -> HTTPResponse:
        if request.authorization_header is None:
            return self.handle_api_error(
                APIError(ErrorCodes.UNAUTHORIZED, "No authorization header"))

        authorization = request.authorization_header.split(" ")

        if authorization[0] == "Bearer":
            try:
                login = self.authorization_controller.verify_token(authorization[1])

                authorized_request = AuthorizedHTTPRequest(
                    request.path,
                    request.method,
                    request.json_payload,
                    login
                )

                return self.authorized_handle(authorized_request)
            except jwt.exceptions.DecodeError as ex:
                return self.handle_api_error(APIError(ErrorCodes.UNAUTHORIZED, "Bad token format"))

        return self.handle_api_error(
            APIError(ErrorCodes.UNAUTHORIZED, "Unknown authorization scheme"))

    @abstractmethod
    def authorized_handle(self, request: AuthorizedHTTPRequest) -> HTTPResponse:
        pass
