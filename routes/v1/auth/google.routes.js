const googleAuthRouteV1 = require("express").Router();
const passport = require("passport");
const isGoogleOrJWTAuthorizedMiddleware = require("../../../app/middleware/auth.middleware");
const googleAuthAuthorizationController = require("../../../app/controllers/auth/google.auth.controller");
const { FE_URI } = require("../../../config/config");
/**
 * Google OAuth Authentication Route
 *
 * GET /auth/google - Initiates the Google OAuth authentication process for user sign-in or registration.

 * Middleware used in the route:
 * - `passport.authenticate("google", { scope: ["email", "profile"] })`: Initiates Google OAuth authentication with specified scopes.

 * The route performs the following actions:
 * 1. Initiates the Google OAuth authentication process for user sign-in or registration.
 * 2. Requests user's email and profile information during authentication.

 * The route is designed for integrating Google OAuth-based authentication with your application.

 * Route Path: GET /auth/google

 * Middleware Function:
 * - passport.authenticate("google", { scope: ["email", "profile"] }): Initiates Google OAuth authentication with email and profile scopes.
 */

googleAuthRouteV1.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
/**
 * Google OAuth Callback Route
 *
 * GET /auth/google/callback - Handles the callback from Google OAuth authentication.

 * Middleware used in the route:
 * - `passport.authenticate("google", { successRedirect, failureRedirect })`: Handles the authentication callback.

 * The route performs the following actions:
 * 1. Handles the callback from Google OAuth authentication.
 * 2. Redirects to the success or failure route based on the authentication result.

 * Route Path: GET /auth/google/callback

 * Middleware Function:
 * - passport.authenticate("google", {
 *     successRedirect: "/api/v1/auth/google/success",
 *     failureRedirect: "/api/v1/auth/google/failure"
 *   }): Handles the authentication callback and redirects to the appropriate success or failure route.
 */

googleAuthRouteV1.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/google/success",
    failureRedirect: "/api/v1/auth/google/failure",
  })
);

/**
 * Google Auth Success Route
 *
 * GET /auth/google/success - Handles successful Google authentication and redirects to a front-end verification page.

 * Middleware functions in the route:
 * - `isGoogleOrJWTAuthorizedMiddleware`: Middleware to check Google or JWT authorization.
 * - `googleAuthAuthorizationController`: Controller for Google authentication authorization.

 * The route performs the following actions:
 * 1. Checks Google or JWT authorization to ensure the user is authenticated.
 * 2. After successful authentication, it redirects to a front-end verification page.
 * 3. The JWT is included as a query parameter in the redirection URL.

 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object for sending responses.

 * Route Path: GET /auth/google/success

 * Middleware Functions:
 * - isGoogleOrJWTAuthorizedMiddleware: Middleware to check Google or JWT authorization.
 * - googleAuthAuthorizationController: Controller for Google authentication authorization.

 * Note: The route redirects to a front-end verification page with a JWT query parameter.
 */

googleAuthRouteV1.get(
  "/auth/google/success",
  isGoogleOrJWTAuthorizedMiddleware,
  googleAuthAuthorizationController,
  (req, res) => {
    const jwt = req.jwt;
    // return res.send(jwt)
    res.redirect(`${FE_URI}auth/verify?token=${jwt}`)
  }
);

/**
 * Google OAuth Failure Route
 *
 * GET /auth/google/failure - Handles the failure scenario in the Google OAuth authentication process.

 * The route performs the following action:
 * Responds with a status code of 401 (Unauthorized) to  indicate a failure in the Google OAuth authentication.

 * Route Path: GET /auth/google/failure
 */

googleAuthRouteV1.get("/auth/google/failure", (req, res) =>
  res.sendStatus(401)
);

module.exports = googleAuthRouteV1;
 