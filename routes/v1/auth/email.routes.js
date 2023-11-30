const authRouteV1 = require("express").Router();
const {
  emailAuthValidationController,
  createNewAccountController,
  authEmailGenerateJWTController,
  isrequiredToAuthorizeEmailCredentialsController,
  authorizeEmailCreadentialsController,
} = require("../../../app/controllers/auth/email.auth.controller");

/**
 * Create New User Account Route
 *
 * POST /auth/create - Handles the creation of a new user account with email-based authentication.

 * Middleware functions in the route:
 * - `emailAuthValidationController`: Middleware for validating email parameters and checking email uniqueness.
 * - `createNewAccountController`: Middleware for creating a new user account.
 * - `createAccountGenerateJwtController`: Middleware for generating a JWT for the newly created account.

 * The route performs the following actions:
 * 1. Validates email parameters and checks email uniqueness using 'emailAuthValidationController'.
 * 2. Creates a new user account using 'createNewAccountController'.
 * 3. Generates a JWT for the newly created account using 'createAccountGenerateJwtController'.
 * 4. Sends a 200 (OK) JSON response with a success message and the generated JWT.
 * 5. In case of any errors during the process, it sends a 500 (Internal Server Error) response with an error message.

 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object for sending responses.

 * Route Path: POST /auth/create

 * Middleware Functions:
 * - emailAuthValidationController: Middleware for email validation and checking email uniqueness.
 * - createNewAccountController: Middleware for creating a new user account.
 * - createAccountGenerateJwtController: Middleware for generating a JWT for the newly created account.

 * Note: The route creates a new user account and returns a JWT for authentication.

 */

authRouteV1.post(
  "/auth/create",
  emailAuthValidationController,
  createNewAccountController,
  authEmailGenerateJWTController
);
authRouteV1.post(
  "/auth/email",
  isrequiredToAuthorizeEmailCredentialsController,
  authorizeEmailCreadentialsController,
  authEmailGenerateJWTController
);
module.exports = authRouteV1;
