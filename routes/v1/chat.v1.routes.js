const chatv1 = require("express").Router();
const pdf = require("pdf-parse");
const fs = require("fs");
const passport = require("passport");
// const path = require("path");
const GPT = require("openai");
const { OpenAI } = require("langchain/llms/openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const {
  CharacterTextSplitter,
  RecursiveCharacterTextSplitter,
} = require("langchain/text_splitter");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { RetrievalQAChain } = require("langchain/chains");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { OPEN_AI_KEY, GPT_COMPLETION_MODEL } = require("../../config/config");
const {
  isRequiredToStartConversation,
  startNewConversationController,
  continueConversationController,
} = require("../../app/controllers/chat/conversations/conversation.controller");

const model = new OpenAI({
  openAIApiKey: OPEN_AI_KEY,
  temperature: 1,
  modelName: "gpt-4",
});
const gpt = new GPT({ apiKey: OPEN_AI_KEY });
const Embedding = new OpenAIEmbeddings({
  openAIApiKey: OPEN_AI_KEY,
  modelName: "text-embedding-ada-002",
});

const extractTextFromPDF = async (doc) => {
  const dataBuffer = fs.readFileSync(doc);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
};

const aiChatOpenAIService = async (question) => {
  // Use the OpenAI GPT model to create completions.
  const completion = await gpt.completions.create({
    model: GPT_COMPLETION_MODEL, // Specify the model to use (e.g., GPT_COMPLETION_MODEL)
    prompt: question, // Set the 'question' as the prompt for the model.
    max_tokens: 200, // Limit the response to a maximum of 200 tokens.
  });

  // Extract the generated text from the model's response, if available
  const response = completion?.choices[0].text;
  // Return the generated response to the caller.
  return response;
};

const knowUnknow = async (question, text) => {
  const unknown = [
    " I'm sorry, I don't know.",
    "Hi there! I'm sorry, but I'm not able to answer your question.",
    " I'm sorry, I don't know the answer to your question.",
    "I don't know.",
    "I'm sorry, I don't know the answer to that question.",
    "Hi! Unfortunately I don't know the answer to your question.",
    " I'm not able to help you with this question.",
  ];

  let iDontKnow = unknown.some(
    (t) => t.toLowerCase().trim() === text.toLowerCase().trim()
  );
  // console.log({iDontKnow})

  if (iDontKnow) return await aiChatOpenAIService(question, text);
  return text;
};
/**
 * POST request handler for answering questions from a chat application.
 * This handler loads or creates a vector store for text data, processes user queries, and returns answers.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} A JSON response containing the user's question and the answer.
 */
chatv1.post(
  "/chat",
  passport.authenticate("jwt", { failureMessage: true, session: false }),
  isRequiredToStartConversation,
  startNewConversationController,
  async (req, res, next) => {
    // Define the file and vector store paths.

    const fileName = "word";
    const filePath = `${process.cwd()}/static/${fileName}.txt`;
    // const filePath = `${process.cwd()}/static/${fileName}.pdf`;
    const VECTOR_STORE_PATH = `${process.cwd()}/static/${fileName}.index`;

    try {
      // Extract the user's question from the query parameter.
      const question = req.body.question;
      if (!question || question === "")
        return res.status(400).json({ message: "Please provide a question." });
      let vectorStore;

      // Check if the vector store file exists
      if (!fs.existsSync(VECTOR_STORE_PATH))
        return res
          .status(400)
          .json({
            status: false,
            statusCode: 400,
            message: "Please Provide a vector store with Data",
          });
      // Load the existing vector store if it exists
      vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, Embedding);

      // Create a retrieval and question-answering chain.
      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
      // Perform a question-answering query based on the user's question.
      const query = await chain.call({
        query: question,
      });
      // Return a JSON response with the user's question and the answer.

      let knowMore = await knowUnknow(question, query?.text);

      req.chat = {
        conversationID: req.body.conversationID,
        question: question,
        answer: { text: knowMore.replace(/^\n*/g, "") },
      };
      next();
    } catch (error) {
      // Handle and log errors, and return a JSON error response.
      console.error(error?.message);
      return res.status(400).json(error?.message);
    }
  },
  continueConversationController
);

module.exports = chatv1;
