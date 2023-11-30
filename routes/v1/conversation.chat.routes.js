/**
 * Express Router for Chat Conversations
 *
 * This module sets up an Express router for handling chat-related routes.
 * It imports required dependencies and controllers for chat conversations.

 * Dependencies:
 * - express: Express web application framework.
 * - passport: Middleware for authentication (e.g., JWT authentication).

 * Controllers:
 * - getChatConversationController: Retrieves chat conversations for a user.
 * - requiredGetConversationsController: Middleware for ensuring the presence of a 'chatID' parameter.
 * - getChatConversationsController: Retrieves conversations for a specific chat.

 * The router is used to define and manage chat-related routes within the application.

 * Exports:
 * - conversationRoute: The Express router for chat-related routes.
 */

const conversationRoute = require("express").Router();
const passport = require("passport");
const {
  getChatConversationController,
  requiredGetConversationsController,
  getChatConversationsController,
} = require("../../app/controllers/chat/conversations/conversations.conroller");

/**
 * Chat Conversation Route
 *
 * GET /chat-conversation - Retrieves chat conversations for an authenticated user.

 * Middleware functions in the route:
 * - `passport.authenticate("jwt", { session: false })`: Authenticates the user using JSON Web Tokens (JWT).
 * - `getChatConversationController`: Retrieves chat conversations for the authenticated user.

 * The route performs the following actions:
 * 1. Authenticates the user using JWT to ensure they are authorized.
 * 2. Retrieves chat conversations for the authenticated user.
 * 3. Sends a JSON response containing the chat conversations.

 * The route is designed for authenticated users to access their chat conversations securely.

 * Route Path: GET /chat-conversation

 * Middleware Functions:
 * - passport.authenticate("jwt", { session: false }): JWT authentication with sessions disabled.
 * - getChatConversationController: Retrieves chat conversations for the authenticated user.
 */

conversationRoute.get(
  "/chat-conversation",
  passport.authenticate("jwt", { session: false }),
  getChatConversationController
);

/**
 * Chat Conversations Route
 *
 * GET /chat-conversations - Retrieves chat conversations for a specific chat ID.

 * Middleware functions in the route:
 * - `passport.authenticate("jwt", { session: false })`: Authenticates the user using JSON Web Tokens (JWT).
 * - `requiredGetConversationsController`: Ensures the presence of a required 'chatID' parameter.
 * - `getChatConversationsController`: Retrieves conversations for the specific chat.

 * The route performs the following actions:
 * 1. Authenticates the user using JWT to ensure they are authorized.
 * 2. Ensures the presence of the required 'chatID' parameter in the query string.
 * 3. Retrieves conversations for the specific chat using the identified 'chatID'.
 * 4. Sends a JSON response containing the chat conversations.

 * The route is designed for authenticated users to access conversations related to a specific chat using the chat ID.

 * Route Path: GET /chat-conversations

 * Middleware Functions:
 * - passport.authenticate("jwt", { session: false }): JWT authentication with sessions disabled.
 * - requiredGetConversationsController: Ensures the presence of the 'chatID' parameter.
 * - getChatConversationsController: Retrieves conversations for the specific chat.
 */

conversationRoute.get(
  "/chat-conversations",
  passport.authenticate("jwt", { session: false }),
  requiredGetConversationsController,
  getChatConversationsController
);

/**
 * Conversation Route Module
 *
 * Exports the 'conversationRoute' for handling chat-related routes.

 * This module provides the route configuration for managing chat conversations within the application.

 * Exports:
 * - conversationRoute
 */

module.exports = conversationRoute;
