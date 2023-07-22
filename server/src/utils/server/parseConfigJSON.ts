export const parseConfigJSON = (json: JSON.JSONObject) => {
  try {
    const dict: { [key: string]: string } = {};
    for (let i of Object.keys(json)) {
      for (let j of Object.keys(json[i])) {
        dict[`${i.toUpperCase()}_${j.toUpperCase()}`] = json[i][j];
      }
    }
    return dict;
  } catch (error) {
    return {};
  }
};
