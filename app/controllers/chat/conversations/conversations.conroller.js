const { isRequired } = require("../../../../core/requires");
const chatSchema = require("../../../schemas/chat.schema");
const conversationsSchema = require("../../../schemas/conversations.schema");

/**
 * Required Get Conversations Controller
 *
 * Middleware to ensure the presence of a required 'chatID' parameter in the query string.

 * @param {Object} req - Express request object containing the query parameters.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The function performs the following steps:
 * 1. Attempts to extract the 'chatID' parameter from the query string of the request.
 * 2. Checks if 'chatID' is present and not empty; if not, it returns a 400 (Bad Request) response with an error message.
 * 3. If 'chatID' is present, it passes control to the next middleware.

 * @param {Object} req - Express request object with query parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * @returns {Object} - A 400 (Bad Request) response with an error message or control passed to the next middleware.
 */

const requiredGetConversationsController = (req, res, next) => {
  try {
    const conversationID = req.query.chatID;
    const required = isRequired({ chatID: conversationID }, null);
    if (required !== true)
      return res.status(400).json({ message: required?.error });
    next();
  } catch (e) {
    return res.status(400).json({ message: e?.message });
  }
};

/**
 * Get Chat Conversation Controller
 *
 * Retrieves chat conversations for a user and sends them as a response.

 * @param {Object} req - Express request object, typically containing user information.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The function performs the following steps:
 * 1. Attempts to extract the user's ID from the request.
 * 2. Queries the chat schema to find chat conversations associated with the user.
 * 3. If chat conversations are found, it sends a JSON response with the chat data.
 * 4. If no chat conversations are found, it sends an empty JSON response.
 * 5. In case of any errors, it sends a 400 (Bad Request) response with an error message.

 * @param {Object} req - Express request object with user information.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A JSON response with chat conversations or an error response in case of issues.
 */

const getChatConversationController = async (req, res, next) => {
  try {
    const user = req.user?._id;
    const chatConversation = await chatSchema.find({ user: user });
    if (!chatConversation) return res.status(200).json({});
    return res.json(chatConversation);
  } catch (e) {
    return res.status(400).json({ message: e?.message });
  }
};

/**
 * Get Chat Conversations Controller
 *
 * Retrieves conversations for a specific chat and sends them as a response.

 * @param {Object} req - Express request object containing the chat ID in the query parameters.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The function performs the following steps:
 * 1. Attempts to extract the 'chatID' parameter from the query string of the request.
 * 2. Queries the chat schema to find the chat associated with the 'chatID'.
 * 3. Retrieves conversations from the conversations schema that are linked to the identified chat.
 * 4. Sends a 200 (OK) JSON response containing the retrieved conversations.
 * 5. In case of any errors, it sends a 400 (Bad Request) response with an error message.

 * @param {Object} req - Express request object with the chat ID in the query parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A JSON response with chat conversations or an error response in case of issues.
 */

const getChatConversationsController = async (req, res, next) => {
  try {
    const conversationID = req.query.chatID;
    const conversation = await chatSchema.findOne({ _id: conversationID });
    const conversations = await conversationsSchema.find({
      chat: conversation?._id,
    });
    return res.status(200).json({ conversations });
  } catch (e) {
    return res.status(400).json({ message: e?.message });
  }
};

/**
 * Chat Controllers Module
 *
 * This module exports the following controllers for managing chat conversations:
 * - `getChatConversationController`: Retrieves chat conversations for a user.
 * - `requiredGetConversationsController`: Middleware to ensure the presence of a required 'chatID' parameter.
 * - `getChatConversationsController`: Retrieves conversations for a specific chat.

 * These controllers can be used to handle various aspects of chat conversations within an application.

 * Exports:
 * - getChatConversationController
 * - requiredGetConversationsController
 * - getChatConversationsController
 */

module.exports = {
  getChatConversationController,
  requiredGetConversationsController,
  getChatConversationsController,
};
