/* "id": 1,
"name": "A Martinez",
"description": "Adolph Larrue Martinez III.",
"mbti": "ISFJ",
"enneagram": "9w3",
"variant": "sp/so",
"tritype": 725,
"socionics": "SEE",
"sloan": "RCOEN",
"psyche": "FEVL",
"image": "https://soulverse.boo.world/images/1.png", */

const { userscol } = require("../db/database");
const { getCounter, counterTypes } = require("./counters_model");

module.exports = {

    /**
     * @param {User} user
     * @returns {Promise<Number>} userId
     */
    createUser: async (user) => {
        let userId = await getCounter(counterTypes.TYPE_USER);
        user.id=userId;
        await userscol().insertOne(user);
        return userId;
    },
    /**
     * @param {Number} userId
     * @returns {Promise<boolean>}
     */
    userExists: async (userId) => (await userscol().findOne({ id: userId }, { projection: { _id: 1 } })) != null,
    /**
     * @param {Number} userId
     * @returns userDoc
     */
    fetchUserById: async (userId) => (await userscol().findOne({ id: userId }, { projection: { _id: 0 } }))
}