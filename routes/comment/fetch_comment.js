const { hasLiked } = require("../../model/like_model");
const { fetchCommentsByUser, FILTER_TYPES, SORT_TYPES } = require("../../model/usercomment_model");
const { userExists, fetchMiniUserInfoById } = require("../../model/user_model");

const { ValidationError, CustomError } = require("../../helper/custom_error");

const validateFetchReq = (data) => (
    typeof data.on_id == "number" &&
    typeof data.user_id == "number" &&
    data.filter in FILTER_TYPES &&
    data.sortBy in SORT_TYPES &&
    typeof data.revSort == "boolean" &&
    typeof data.count == "number" &&
    typeof data.pageNum == "number"
)

module.exports = async (data) => {
    if (!validateFetchReq(data))
        throw new ValidationError();

    if (data.count > 20 || data.count < 1)
        data.count = 20;

    if ((await Promise.all([userExists(data.on_id), userExists(data.user_id)])
    ).includes(false))
        throw new CustomError(400, "User not found in db!")

    let userCommentsData = await fetchCommentsByUser(data.on_id, FILTER_TYPES[data.filter], SORT_TYPES[data.sortBy], data.revSort, data.count, data.pageNum);

    ////to attach hasLiked to the comment
    (await Promise.all(
        userCommentsData.userComments.map(
            (userComment) => hasLiked(userComment.id, data.user_id)
        )
    )).forEach((hasLiked, index) => { userCommentsData.userComments[index].hasLiked = hasLiked });
    
    ////to attach userData to the comment
    (await Promise.all(
        userCommentsData.userComments.map(
            (userComment) => fetchMiniUserInfoById(userComment.by_id)
        )
    )).forEach((miniUserInfo, index) => { 
        userCommentsData.userComments[index].name = miniUserInfo.name;
        userCommentsData.userComments[index].image = miniUserInfo.image;
     });

    return userCommentsData;

}