const { likescol } = require("../db/database");

module.exports = {
    createLike: async (comment_id, by_id) => {
        let createdLike = await likescol().updateOne({
            comment_id,
            by_id
        }, {
            $set: {
                by_id
            }
        },
            { upsert: true }
        );
        return (createdLike.modifiedCount+createdLike.upsertedCount> 0)
    },
    removeLike: async (comment_id, by_id) => {
        let removedLike = await likescol().deleteOne({ comment_id, by_id });
        return removedLike.deletedCount > 0;
    },
    hasLiked: async (comment_id, by_id) => (await likescol().findOne({ comment_id, by_id }, { projection: { _id: 1 } })) != null
}