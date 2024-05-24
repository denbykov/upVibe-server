declare namespace JSON {
  type JSONValue =
    | string
    | number
    | boolean
    | int
    | JSONObject
    | JSONArray
    | JSON2DArray
    | JSONError;
  interface JSONObject {
    [x: string]: JSONValue;
  }
  interface JSON2DArray {
    [x: int]: JSONValue[];
  }
  interface JSONArray extends Array<JSONValue> {}
  interface JSONError extends Error {
    name: string;
    message: string;
    stack?: string;
  }
}
