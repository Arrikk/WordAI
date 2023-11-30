const { generateApiKey } = require("../../../core/apiKey,js");
const { errorMessage } = require("../../../core/utils");
const apikeySchema = require("../../schemas/apikey.schema");
const usersSchema = require("../../schemas/users.schema");

const getUserByEmail = async (email, withError = false) => {
  const user = await usersSchema.findOne({ email: email });
  if (withError){
      if (user)
        return errorMessage(409, "Email already in use", { email: email })(null);
    return false;
  }
  if (!withError) return user;
};

const createUserService = async (data) => {
  let user = new usersSchema(data);
  user = await user.save();
  await createApiKey(user?._id)
  return user;
};

const createApiKey = async (userID) => {
  const apiKey = new apikeySchema({
    user: userID,
    secret: generateApiKey()
  })
  return await apiKey.save()
}


// const getUserByPasswordAndEmail
module.exports = { getUserByEmail, createUserService };
