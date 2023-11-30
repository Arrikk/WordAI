const { errorMessage } = require("./utils");
const isRequired = (data, res) => {
  let error = {};
  for (const i of Object.keys(data)) {
    if (data[i] === "" || typeof data[i] === "undefined")
      error[i] = "Is Required";
  }
  if (Object.keys(error).length > 0)
    return errorMessage(400, "Invalid Body Parameters", error)(res);
  return true;
};

module.exports = { isRequired };
