const fs = require("fs");
const Pdf = require("pdf-parse");
const { OpenAI } = require("langchain/llms/openai");
const OpenAi = require("openai");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { OPEN_AI_KEY, GPT_COMPLETION_MODEL } = require("../../../../config/config");
  // Initialize an instance of OpenAI for various AI language tasks.
  const openai = new OpenAI({ openAIApiKey: OPEN_AI_KEY, modelName: GPT_COMPLETION_MODEL });
  // Initialize an instance of OpenAIEmbeddings for text embeddings and similarity calculations.
  const embedding = new OpenAIEmbeddings({ openAIApiKey: OPEN_AI_KEY });
  // Initialize an alternate instance of OpenAI with correct case.
  const gpt = new OpenAi({ apiKey: OPEN_AI_KEY });

/**
 * Service for loading data from a PDF file, managing file paths, and checking the existence of a vector store.
 *
 * @returns An object containing file-related information:
 * - VECTOR_STORE_PATH: The path to the vector store file.
 * - FILE_PATH: The full path to the PDF file.
 * - FILE_NAME: The name of the PDF file.
 * - BOOK_DATA: The content of the PDF file.
 * - VECTOR_EXISTS: A flag indicating whether the vector store file exists.
 * @throws {Error} If there is an error during file loading and processing.
 */
const aiChatFileLoaderService = async () => {
  try {
    // Get the current working directory.
    const workingDir = process.cwd();

    // Define the file-related parameters.
    const fileName = "word";
    const fileExtension = ".pdf";
    const storageDir = "/static/";

    // Create full file paths.
    const fileFullPath = `${workingDir}${storageDir}${fileName}${fileExtension}`;
    const VECTOR_STORE_PATH = `${workingDir}${storageDir}${fileName}.index`;

    // Check if the vector store file exists.
    const vector_exists = fs.existsSync(VECTOR_STORE_PATH)

    // Load data from the PDF fil
    const fileData = await filePDFReader(fileFullPath);

    return {
      VECTOR_STORE_PATH: VECTOR_STORE_PATH,
      FILE_PATH: fileFullPath,
      FILE_NAME: fileName,
      BOOK_DATA: fileData,
      VECTOR_EXISTS: vector_exists
    };
  } catch (e) {
    // Handle and throw an error in case of an exception.
    const error = e?.message ? e?.message : e?.error;
    throw new Error(error);
  }
};

/**
 * Initializes and returns instances of OpenAI services for natural language processing.
 * This function sets up and provides access to the OpenAI API using the provided API key.
 *
 * An object containing instances of OpenAI services:
 * - openai: An instance of OpenAI for various AI language tasks.
 * - openAi: An alternate instance of OpenAI (with correct case) for language tasks.
 * - Embedding: An instance of OpenAIEmbeddings for text embeddings and similarity calculations.
 * 
 */
const aiChatLLNGService = async () => {
  // Return the initialized instances for OpenAI services.
  return {
    openai: openai,
    Embedding: embedding,
  };
};

/**
 *  This asynchronous function, 'aiChatOpenAIService', uses the OpenAI GPT model
 * to generate responses to user questions. It sends the provided 'question' as a prompt
 * to the model and retrieves a response of up to 200 tokens. The response is returned
 * as the result of the function.
 * @param {string} question question for promt generation
 */
const aiChatOpenAIService = async (question, max = 200) => {
  // Use the OpenAI GPT model to create completions.
  const completion = await gpt.completions.create({
    model: GPT_COMPLETION_MODEL, // Specify the model to use (e.g., GPT_COMPLETION_MODEL)
    prompt: question, // Set the 'question' as the prompt for the model.
    max_tokens: max, // Limit the response to a maximum of 200 tokens.
  })

   // Extract the generated text from the model's response, if available
  const response = completion?.choices[0].text;
  // Return the generated response to the caller.
  return response
}

/**
 * This code defines a function named filePDFReader that reads a PDF file and returns its text content.
 * It takes a file path as input, reads the file using the fs module, and then uses the Pdf library to extract the text from the PDF.
 * The extracted text is then returned by the function.
 * @param {string} filePath - The path to the PDF file to be read.
 * @returns {Promise<string>} A Promise that resolves to the text content of the PDF.
 *
 */
const filePDFReader = async (filePath) => {
  // Read the PDF file data from the specified filePath.
  const dataBuffer = fs.readFileSync(filePath);
  // Process the PDF data and extract text content.
  const data = await Pdf(dataBuffer);
  // Return the extracted text from the PDF
  return data.text;
};

module.exports = { aiChatFileLoaderService, aiChatLLNGService, aiChatOpenAIService };
