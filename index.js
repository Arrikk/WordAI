const App = require("./app/app");
const chatv1 = require('./routes/chat/chat.v1.routes')
const chatv2 = require('./routes/chat/chat.v2.routes')
const chatv3 = require('./routes/chat/chat.v3.routes')
const googleAuthRouteV1 = require('./routes/v1/auth/google.routes');
const conversationRoute = require("./routes/v1/conversation.chat.routes");
const authRouteV1 = require("./routes/v1/auth/email.routes");
const apiRouter = require("./routes/chat/chat.api.routes");
const storeRouter = require("./routes/v1/store.routes");

require("dotenv").config({ path: "./.env" });

// Initialize a new instance of an application (App) with a specified port, defaulting to 8080 if not provided.
const init = new App({ port: process.env.PORT || 8080 });
// Configure the routes for the application.
// The '/' path is associated with an array of route objects, including addressRoute, depositRoute, stakingRoute, withdrawalRoute, and swapRoute.
init.runApp([
  {
    path: "/api/v1/",
    object: [
      googleAuthRouteV1,
      authRouteV1,
      conversationRoute,
      chatv1,
      apiRouter,
      storeRouter
    ],
  },
  {
    path: "/api/v2/",
    object: [ 
      chatv2
    ],
  },
  {
    path: "/api/v3/",
    object: [ 
      chatv3
    ],
  },

]);