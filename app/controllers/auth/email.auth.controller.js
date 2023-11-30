const passport = require("passport");
const { isRequired } = require("../../../core/requires");
const {
  emailValidatorHelper,
  passwordEncHelper,
  passwordDecHelper,
} = require("../../helpers/ancillary.helpers");
const { getUserByEmail, createUserService } = require("./auth.service");
const { errorMessage } = require("../../../core/utils");
const { generateJwtHelper } = require("../../helpers/jwt.helper");

/**
 * Email Authentication Validation Middleware
 *
 * Middleware for validating parameters and checking the uniqueness of an email during email-based authentication.

 * @param {Object} req - Express request object containing the request body.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The middleware performs the following steps:
 * 1. Extracts 'first_name', 'last_name', 'password', and 'email' from the request body.
 * 2. Ensures the presence of these parameters; if not, it returns a 400 (Bad Request) response with an error message.
 * 3. Validates the email format using the 'emailValidatorHelper'; if invalid, it returns a 400 (Bad Request) response with an error message.
 * 4. Checks if the email already exists using 'emailExists'; if it does, it returns a 409 (Conflict) response with an error message.
 * 5. If all validations pass, it passes control to the next middleware.

 * @param {Object} req - Express request object with the request body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A 400 (Bad Request) or 409 (Conflict) response with an error message or control passed to the next middleware.
 */

const emailAuthValidationController = async (req, res, next) => {

    // extract thr required data from the body
  const { first_name, last_name, password, email } = req.body;
  // pass the data to a validation method to validate the data
  // specifically checking for rmpty valies
  const isrequired = isRequired(
    { first_name, last_name, password, email },
    null
  );
  // if some data are empty return an error message
  if (isrequired !== true) return res.status(400).json(isrequired);

  // check if the email is valid, using an email validation helper function
  const emailValidator = emailValidatorHelper(email, null);
  // return error if not valid
  if (emailValidator !== true) return res.status(400).json(emailValidator);

  // check if ther email already exists using the emailExists method/function
  // from the service file
  const EMAIL_EXISTS = await getUserByEmail(email, true);
  // return an error if this email already exists
  if (EMAIL_EXISTS !== false) return res.status(409).json(EMAIL_EXISTS);
  next();// next to the next controller
};

/**
 * Create New Account Controller
 *
 * Middleware for creating a new user account.

 * @param {Object} req - Express request object containing the request body.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The controller performs the following steps:
 * 1. Extracts 'first_name', 'last_name', 'password', and 'email' from the request body.
 * 2. Hashes the password using 'passwordEncHelper'.
 * 3. Prepares user data for creating a new account, including hashed password and email verification status.
 * 4. Saves the user data using 'createUserService'.
 * 5. Sets the created user data to the request object for further use.
 * 6. Passes control to the next middleware.

 * @param {Object} req - Express request object with the request body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A 500 (Internal Server Error) response with an error message or control passed to
*/

const createNewAccountController = async (req, res, next) => {
  try {
    const { first_name, last_name, password, email } = req.body;
    const pwdHash = passwordEncHelper(password);
    const data = {
      password: pwdHash,
      firstName: first_name,
      lastName: last_name,
      email: email,
      email_verified: false,
      name: `${last_name} ${first_name}`,
    };
    const save = await createUserService(data);
    req.user = save;
    next();
  } catch (e) {
    const message = e?.message ? e.message : e?.error;
    const error = errorMessage(500, message)(null);
    return res.status(500).json(error);
  }
};

/**
 * Create Account and Generate JWT Controller
 *
 * Middleware for creating a new user account and generating a JWT.

 * @param {Object} req - Express request object containing the request body.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The controller performs the following steps:
 * 1. Generates a JWT for the user using 'generateJwtHelper'.
 * 2. Sends a 200 (OK) JSON response with a success message and the generated JWT.
 * 3. In case of any errors, it sends a 500 (Internal Server Error) response with an error message.

 * @param {Object} req - Express request object with the request body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A 200 (OK) JSON response with a success message and the generated JWT or a 500 (Internal Server Error) response with an error message.
 */

const authEmailGenerateJWTController = (req, res, next) => {
  try {
    // genetate JWT
    const jwt = generateJwtHelper(req.user);
    return res.status(200).json({ message: "Success", jwt: jwt });
  } catch (e) {
    const message = e?.message ? e.message : e?.error;
    const error = errorMessage(500, message)(null);
    return res.status(500).json(error);
  }
};


const isrequiredToAuthorizeEmailCredentialsController = (req, res, next) => {
    const {email, password} = req?.body
    const isrequired = isRequired({password, email },null);
    // if some data are empty return an error message
    if (isrequired !== true) return res.status(400).json(isrequired);

    const emailValidator = emailValidatorHelper(email, null);
    // return error if not valid
    if (emailValidator !== true) return res.status(400).json(emailValidator);
    next()
}

const authorizeEmailCreadentialsController = async (req, res, next) => {
   try{
       const {email, password} = req?.body
       const user = await getUserByEmail(email);
       if(!user || user?.password === null) return errorMessage(401, "Your credentials are invalid", {email, password})(res)

    //    console.log({password, hash: user?.password})         
       const compare = passwordDecHelper(password, user?.password);
       if(!compare) return errorMessage(401, "Your credentials are invalid", {email, password})(res)
       req.user = user;
       next()
   }catch(e){
    const message = e?.message ? e?.message : e?.error;
    return errorMessage(500, message)(res)
   }
}

module.exports = {
  emailAuthValidationController,
  createNewAccountController,
  authEmailGenerateJWTController,
  isrequiredToAuthorizeEmailCredentialsController,
  authorizeEmailCreadentialsController
};
