const storeRouter = require('express').Router();

storeRouter.post('/store-chats', function (req, res)  {
    res.json({message: "Chat Applied to conversation"})
})

module.exports = storeRouter