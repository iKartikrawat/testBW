const { createLike, removeLike } = require("../../model/like_model");
const { commentExists, incCommentLike, decCommentLike } = require("../../model/usercomment_model");
const { userExists } = require("../../model/user_model")
const { ValidationError,CustomError } = require("../../helper/custom_error");

const validateRequest=(data)=>(
    typeof data.by_id =="number"&&
    typeof data.comment_id=="number"&&
    typeof data.like=="boolean"
)

module.exports= async (data) => {
    if(!validateRequest(data))
    throw new ValidationError();
    if (!await userExists(data.by_id))
        throw new CustomError(404,"User not found!");
    if (!await commentExists(data.comment_id))
        throw new CustomError(404,"Comment not found!");

    if (data.like) {
        if (await createLike(data.comment_id, data.by_id))
            await incCommentLike(data.comment_id);
    }
    else {
        if (await removeLike(data.comment_id, data.by_id))
            await decCommentLike(data.comment_id);
    }
    return true;
};

