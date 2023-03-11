import traceback


class LogContext:
    @staticmethod
    def form(obj) -> str:
        return obj.__class__.__name__ + "::" + traceback.extract_stack(None, 2)[0][2]
