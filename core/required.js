const debouncer = require("../../core/debouncer");
const { isRequired } = require("../../core/requires");
const { errorMessage } = require("../../core/utils");


const withdrawParams = (req, res, next) => {
  const body = req?.body;
  if (
    !isRequired(
      {
        note: body?.note ?? "",
        user_id: body?.user_id ?? "",
        amount: body?.amount ?? "",
        request_id: body?.request_id ?? "",
        account_number: body?.account_number ?? "",
        account_name: body?.account_name ?? "",
        bank_name: body?.bank_name ?? "",
        bank_code: body?.bank_code ?? "",
      },
      res
    )
  )
    return;

       // :::::::::: ======= DEBOUNCE ========== ::::::::::
       if(!debouncer(body?.user_id)(res)) return;
       // ========================================================

    // Validate amount is a number
    if(typeof body.amount !== 'number') return errorMessage(400, "Please check amount and try again",)(res)

    // Validate aamount is not negative
    if(body.amount <= 0 ) return errorMessage(400, "Please check amount and try again",)(res)
  console.log("Validation Successful");
  next();
};

module.exports = {
  withdrawParams,
};
