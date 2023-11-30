const chatv2 = require("express").Router();
const {isRequiredAiParamController, aiQuestionAnswerController} = require("../../app/controllers/chat/ai/ai.chat.controller")

chatv2.post("/chat", isRequiredAiParamController, aiQuestionAnswerController );


module.exports = chatv2;
