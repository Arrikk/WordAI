const validator = require("validator");
const bcrypt = require('bcryptjs')
const { errorMessage } = require("../../core/utils");
/**
 * Validate Email Address using validator..
 * @param {String} email email to validate
 * @param {*} res Express Response 
 * @returns {Boolean}
 */
const emailValidatorHelper = (email, res) => {
    if (!validator.isEmail(email))
      return errorMessage(400, "Invalid Email Address", {
        email,
        example: "example@example.com",
      })(res);
    return true;
};

const passwordEncHelper = (password) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt);
  return hash
}

const passwordDecHelper = (password, hash) => {
  const compare = bcrypt.compareSync(password, hash)
  return compare;
}

function paginateResults(request, query) {
  const page = parseInt(request.query.page) || 1;
  let limit = parseInt(request.query.limit) || 10;
  const maxLimit = 50;

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  return query
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
}



module.exports = {emailValidatorHelper, paginateResults, passwordEncHelper, passwordDecHelper}