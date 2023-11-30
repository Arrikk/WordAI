const { isRequired } = require("../../../../core/requires");
const { errorMessage, successMessage } = require("../../../../core/utils");
const {
  aiChatFileLoaderService,
  aiChatLLNGService,
} = require("./ai.chat.service");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { CharacterTextSplitter } = require("langchain/text_splitter");
const { RetrievalQAChain } = require("langchain/chains");
const apikeySchema = require("../../../schemas/apikey.schema");
// JavaScript code for ai.chat.controller.js

/**
 * This code defines a controller function that checks if the 'question' parameter is required.
 * It retrieves the 'question' value from the request body and uses the 'isRequired' function to determine if it is required.
 * If the 'question' parameter is not required, the function returns without further processing.
 * Otherwise, it calls the next middleware function.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} A response containing the answer to the user's question.
 */
const isRequiredAiParamController = async (req, res, next) => {
  // Extract the question parameter
  const question = req.body.question;
  // validate the question is not empty
  const required = isRequired({ question: question }, res);
  if (!required) return;
  // move to next controller
  return next();
};

/**
 * Controller for answering a user's question using a combination of services for natural language processing.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} A response containing the answer to the user's question.
 */
const aiQuestionAnswerController = async (req, res, next) => {
  try {
    // Extract the user's question from the request body.
    const question = req.body.question;
    // Initialize AI services for file loading and natural language processing.
    const fc = await aiChatFileLoaderService();
    const ai = await aiChatLLNGService();

    let vectorStore;

    // Check if a vector store already exists.
    if (fc?.VECTOR_EXISTS) {
      // Load the existing vector store if it exists.
      vectorStore = await HNSWLib.load(fc.VECTOR_STORE_PATH, ai.Embedding);
    }

     // Create a retrieval and question-answering chain using AI services.
    const chain = RetrievalQAChain.fromLLM(ai.openai, vectorStore.asRetriever());
     // Perform a question-answering query based on the user's question.
    const query = await chain.call({ query: question });
     // Extract the answer from the query result.
    const answer = query?.text;
    // Return a success response with the answer and additional information.
    return successMessage(200, "Answer", {
      question: question,
      answer: answer,
      chunks: { size: 2000, lap: 200 },
    })(res);
  } catch (e) {
     // Handle and return an error response in case of an exception.
    const message = e?.message ? e?.message : e?.error;
    return errorMessage(400, message)(res);
  }
};

const aiCompleteUnknownController = async (question, text) => {
    const unknown = [
      " I'm sorry, I don't know.",
      "Hi there! I'm sorry, but I'm not able to answer your question.",
      " I'm sorry, I don't know the answer to your question.",
      "I don't know.",
      "Hi! Unfortunately I don't know the answer to your question.",
      " I'm not able to help you with this question."
    ];

    let iDontKnow = unknown.some(t => t.toLowerCase().trim() === text.toLowerCase().trim())
    // console.log({iDontKnow})

    if(iDontKnow) return await aiChatOpenAIService(question, text)
    return text
};


const validateApiKeyController = async (req, res, next) => {
  try{
    const apiKey = req.headers['x-token']
    if(!apiKey) return errorMessage(401, "Please Provide an authorization token")(res)
  
    const token = await apikeySchema.findOne({secret: apiKey});
    if(!token) return errorMessage(401, "Invalid Auth Token")(res)
    return next()
  }catch(e){
    const mssg = e?.message ? e?.message : e.error
    return errorMessage(400, mssg)(res)
  }
}

module.exports = { isRequiredAiParamController, aiQuestionAnswerController, aiCompleteUnknownController, validateApiKeyController};
