import unittest
from unittest.mock import *

from source.tests.DataAccessorMock import *
from source.Business.Controllers.UserController import UserController, sha256, APIError

from source.Data.utils import *


class UserControllerTest(unittest.TestCase):
    def setUp(self):
        self.data_accessor = DataAccessorMock()
        self.controller = UserController(self.data_accessor, "secret")

    def test_create_user_success(self):
        self.data_accessor.add_user = \
            create_autospec(
                self.data_accessor.add_user,
                return_value=make_da_response(result=None))

        credentials = UserCredentials("user", "password")

        error = self.controller.create_user(credentials)

        self.data_accessor.add_user.assert_called_once_with(credentials)

        self.assertIsNone(error, "failed to create user")

    def test_create_user_fail(self):
        error = make_da_response(error=ErrorCodes.RESOURCE_ALREADY_EXISTS)
        self.data_accessor.add_user = \
            create_autospec(
                self.data_accessor.add_user,
                return_value=error)

        credentials = UserCredentials("user", "password")

        error = self.controller.create_user(credentials)

        self.data_accessor.add_user.assert_called_once_with(credentials)

        self.assertIsNotNone(error, "existing user created")

        self.assertEqual(
            error.code, ErrorCodes.RESOURCE_ALREADY_EXISTS, "wrong error code")

        self.assertEqual(
            error.msg, "User already exists", "wrong user message")

    def test_login_user_success(self):
        credentials = UserCredentials("user", "password")

        da_result = make_da_response(result=sha256(credentials.password.encode()).hexdigest())

        self.data_accessor.get_password = \
            create_autospec(self.data_accessor.get_password, return_value=da_result)

        result = self.controller.login(credentials)

        self.data_accessor.get_password.assert_called_once_with(credentials.login)

        self.assertNotIsInstance(result, APIError, "failed to create jwt token for existing user")

    def test_login_user_fail(self):
        credentials = UserCredentials("user", "password")

        da_result = make_da_response(error=ErrorCodes.NO_SUCH_RESOURCE)

        self.data_accessor.get_password = \
            create_autospec(self.data_accessor.get_password, return_value=da_result)

        result = self.controller.login(credentials)

        self.data_accessor.get_password.assert_called_once_with(credentials.login)

        self.assertIsInstance(result, APIError, "login succeeded for non existing user")
