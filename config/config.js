require("dotenv").config();
const axios = require("axios");

module.exports = {
  axios,
  OPEN_AI_KEY: process.env.OPEN_AI_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  GPT_COMPLETION_MODEL: process.env.GPT_COMPLETION_MODEL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  FE_URI: process.env.FE_BASE_URI,
  BE_URI: process.env.BE_BASE_URI
};
