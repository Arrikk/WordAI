const { errorMessage } = require("./utils");

let bouncer = new Set();
const debouncer =
  (user_id, remove = false, check = true) =>
  (res) => {
    // Add User to debouncer
    if (!check && !remove) {
      bouncer.add(user_id);
      setTimeout(() => bouncer.delete(user_id), 30000);
      return true;
    }

    // Check if userid is in debouncer
    if (check && bouncer.has(user_id))
      return errorMessage(
        400,
        "Please wait while we process last transaction",
        {}
      )(res);

    // add user to bouncer list
    return true;
  };

module.exports = debouncer;
