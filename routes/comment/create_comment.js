const { MBTI_TYPES, ENNEAGRAM_TYPES, ZODIAC_TYPES } = require("../../helper/constants");
const { userExists } = require("../../model/user_model");

const { ValidationError, CustomError } = require("../../helper/custom_error");
const { ifUndef } = require("../../util");
const { createComment } = require("../../model/usercomment_model");


const validateCommentData = (commentData) =>
    (typeof commentData.title == "string" && commentData.title.length > 0) &&
    (typeof commentData.description == "string" && commentData.description.length > 0) &&
    ((commentData.mbti == null) ||
        MBTI_TYPES.includes(commentData.mbti)
    ) &&
    ((commentData.enneagram == null) ||
        ENNEAGRAM_TYPES.includes(commentData.enneagram)
    ) &&
    ((commentData.zodiac == null) ||
        ZODIAC_TYPES.includes(commentData.zodiac)
    ) &&
    typeof commentData.by_id == "number" &&
    typeof commentData.on_id == "number"

module.exports = async (commentData) => {

    commentData = {
        title: commentData.title,
        description: commentData.description,
        mbti: ifUndef(commentData.mbti, null),
        enneagram: ifUndef(commentData.enneagram, null),
        zodiac: ifUndef(commentData.zodiac, null),
        on_id: commentData.on_id,
        by_id: commentData.by_id,
        likes_count: 0
    };
    
    if (!validateCommentData(commentData))
        throw new ValidationError();

    if ((await Promise.all([userExists(commentData.on_id), userExists(commentData.by_id)])
    ).includes(false))
        throw new CustomError(400, "User not found in db!")

    return await createComment(commentData);
}