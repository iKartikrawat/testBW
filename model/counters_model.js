const { counterscol } = require("../db/database");

module.exports = {

    counterTypes:{
        TYPE_USER:"user",
        TYPE_COMMENT:"comment"
    },

    /**
     * @returns {Promise<Number>}
     */
    getCounter: async (counter_type) => {
        let data = await counterscol().findOneAndUpdate({
            cType: counter_type
        }, {
            $inc: {
                count: 1
            }
        }, {
            projection: {
                _id: 0,
                cType: 0,
            },
            returnDocument: 'after',
            upsert: true
        });
        return data.value.count;
    }
}