////middleware to handle unexpected errors and results

const { CustomError, ValidationError } = require("../helper/custom_error");

/**
 * @param {Promise} moduleToRun
 */
const jsonPostReq = (moduleToRun) => (req, res) => new Promise((resolve, reject) => {
    if (!req.body)
        reject(new ValidationError("Validation Failed!! Must have a JSON body!"))
    else
        moduleToRun(req.body).then(
            (data) => (resolve(data)),
            (err) => (reject(err))
        );
}).then(
    (result) => res.status(200).json({ data: result }),
    (error) => res.status((error instanceof CustomError) ? error.code : 500).json({
        message: error.message
    })

);
module.exports = {
    jsonPostReq
} 