const { MBTI_TYPES, ENNEAGRAM_TYPES } = require("../../helper/constants");
const { createUser } = require("../../model/user_model");
const { ValidationError } = require("../../helper/custom_error");
const { ifUndef } = require("../../util");

const validateUserData = (userData) =>
    (typeof userData.name == "string" && userData.name.length > 0) &&
    ((typeof userData.description == "string")||userData.description==null) &&
    (MBTI_TYPES.includes(userData.mbti)||userData.mbti==null)&&
    (ENNEAGRAM_TYPES.includes(userData.enneagram)||userData.enneagram==null) &&
    ((typeof userData.variant == "string")||userData.variant==null) &&
    ((typeof userData.tritype == "number")||userData.tritype==null) &&
    ((typeof userData.socionics == "string")||userData.socionics==null) &&
    ((typeof userData.sloan == "string")||userData.sloan==null) &&
    ((typeof userData.psyche == "string")||userData.psyche==null) &&
    ((typeof userData.image == "string")||userData.image==null);////TODO: Add url regex check here

module.exports = async (userData) => {

    userData = {
        name:userData.name,
        description:ifUndef( userData.description,null),
        mbti:ifUndef( userData.mbti,null),
        enneagram:ifUndef( userData.enneagram,null),
        variant:ifUndef( userData.variant,null),
        tritype:ifUndef( userData.tritype,null),
        socionics:ifUndef( userData.socionics,null),
        sloan:ifUndef( userData.sloan,null),
        psyche:ifUndef( userData.psyche,null),
        image:ifUndef( userData.image,null)
    };

    if (!validateUserData(userData))
        throw new ValidationError();

    return await createUser(userData);
};