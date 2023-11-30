const {
  isRequiredAiParamController,
  aiQuestionAnswerController,
  validateApiKeyController
} = require("../../app/controllers/chat/ai/ai.chat.controller");
const { generateApiKey } = require("../../core/apiKey,js");

const apiRouter = require("express").Router();

apiRouter.post(
  "/model/chat",
  // validateApiKeyController,
  isRequiredAiParamController,
  aiQuestionAnswerController
);

module.exports = apiRouter;
