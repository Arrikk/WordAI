const chatv2 = require("express").Router();
const {isRequiredAiParamController, aiQuestionAnswerController} = require("../../app/controllers/chat/ai/ai.chat.controller")

chatv2.post("/chat", 
  passport.authenticate("jwt", { failureMessage: true, session: false }), isRequiredAiParamController, aiQuestionAnswerController );


module.exports = chatv2;
