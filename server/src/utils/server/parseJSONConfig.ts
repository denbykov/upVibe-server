export const parseJSONConfig = (json: JSON.JSONObject) => {
  try {
    const dict: { [key: string]: string } = {};
    for (const i of Object.keys(json)) {
      for (const j of Object.keys(json[i])) {
        dict[`${i.toUpperCase()}_${j.toUpperCase()}`] = json[i][j];
      }
    }
    return dict;
  } catch (error) {
    return {};
  }
};
