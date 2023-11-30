const { isRequired } = require("../../../../core/requires")
const chatSchema = require("../../../schemas/chat.schema")
const conversationsSchema = require("../../../schemas/conversations.schema")
const { aiChatOpenAIService } = require("../ai/ai.chat.service")

/**
 * Required to Start Conversation Middleware
 *
 * Middleware to ensure the presence of required parameters in the request body before starting a conversation.

 * @param {Object} req - Express request object containing the request body.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The middleware performs the following steps:
 * 1. Retrieves 'conversationID', 'newChat', and 'question' from the request body.
 * 2. Checks if these parameters are present and not empty; if not, it returns a 400 (Bad Request) response with an error message.
 * 3. If all required parameters are present, it passes control to the next middleware.

 * @param {Object} req - Express request object with the request body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A 400 (Bad Request) response with an error message or control passed to the next middleware.
 */

const isRequiredToStartConversation = (req, res, next) => {
    const conversationID = req.body.conversationID
    const newChat = req?.body?.newChat
    const question = req?.body?.question
    const required = isRequired({conversationID, newChat, question}, null)
    // console.log(required)
    if(required !== true) return res.status(400).json(required?.error);
    next()
}

/**
 * Required to Start Conversation Middleware
 *
 * Middleware to ensure the presence of required parameters in the request body before starting a conversation.

 * @param {Object} req - Express request object containing the request body.
 * @param {Object} res - Express response object for sending responses.
 * @param {Function} next - Express middleware function for passing control to the next handler.

 * The middleware performs the following steps:
 * 1. Retrieves 'conversationID', 'newChat', and 'question' from the request body.
 * 2. Checks if these parameters are present and not empty; if not, it returns a 400 (Bad Request) response with an error message.
 * 3. If all required parameters are present, it passes control to the next middleware.

 * @param {Object} req - Express request object with the request body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function.

 * @returns {Object} - A 400 (Bad Request) response with an error message or control passed to the next middleware.
 */

const startNewConversationController = async (req, res, next) => {
    try{
        const newChat = req.body.newChat

        console.log(newChat)
        if(newChat === false) return next()

        const prompt = `Generate a title for this text: ${req.question}`
        const generateTitle = await aiChatOpenAIService(prompt, 20)
    
        let createNewChat = new chatSchema({
            title: generateTitle,
            user: req.user?._id
        })
        createNewChat = await createNewChat.save()
        req.body.conversationID = createNewChat._id
        // res.json(createNewChat)
        return next()
    }catch(e){
        return res.status(400).json({message: e?.message ? e?.message : e?.error})
    }
}

/**
 * Continue Conversation Controller
 *
 * Controller for continuing a conversation by storing the bot's response and related information.

 * @param {Object} req - Express request object containing conversation data.
 * @param {Object} res - Express response object for sending responses.

 * The controller performs the following actions:
 * 1. Retrieves conversation data from the request, including the bot's response and the associated question.
 * 2. Creates a new entry in the conversations schema to store the bot's response, question, and chat ID.
 * 3. Sends a 200 (OK) JSON response with the stored conversation data.
 * 4. In case of any errors, it sends a 400 (Bad Request) response with an error message.

 * @param {Object} req - Express request object with conversation data.
 * @param {Object} res - Express response object.

 * @returns {Object} - A 200 (OK) JSON response with the stored conversation data or a 400 (Bad Request) response with an error message.
 */

const continueConversationController = async (req, res) => {
    try {
        const data = req.chat;
        let storeConversation = new conversationsSchema({
            bot: data?.answer?.text,
            question: data?.question,
            chat: data?.conversationID
        })
        await storeConversation.save()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({message: e?.message ? e?.message : e?.error})
    }
}

/**
 * Conversation Controllers Module
 *
 * This module exports the following controllers for managing conversations:
 * - `isRequiredToStartConversation`: Middleware to ensure the presence of required parameters for starting a conversation.
 * - `startNewConversationController`: Controller for starting a new conversation, including title generation.
 * - `continueConversationController`: Controller for continuing a conversation by storing the bot's response.

 * These controllers are used to handle different aspects of conversation management within the application.

 * Exports:
 * - isRequiredToStartConversation
 * - startNewConversationController
 * - continueConversationController
 */

module.exports = {isRequiredToStartConversation, startNewConversationController, continueConversationController}