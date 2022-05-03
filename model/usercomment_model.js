const { commentscol } = require("../db/database");
const { getCounter, counterTypes } = require("./counters_model");
const { CustomError } = require("../helper/custom_error");
module.exports = {
    SORT_TYPES: {
        RECENT: "_id",
        BEST: "likes_count",
    },

    FILTER_TYPES: {
        MBTI: {
            mbti: { $ne: null }
        },
        ANNEAGRAM: {
            anneagram: { $ne: null }
        },
        ZODIAC: {
            zodiac: { $ne: null }
        },
        null: null
    },

    createComment: async (userComment) => {
        userComment.id = await getCounter(counterTypes.TYPE_COMMENT);
        let createdUser = await commentscol().insertOne(userComment);
        if (createdUser.insertedId)
            return userComment.id;
        else
            throw new CustomError(500, "Error inserting doc to DB!")
    },

    commentExists: async (commentId) => (await commentscol().findOne({ id: commentId })) != null,

    incCommentLike: async (comment_id) => {
        await commentscol().updateOne({ id: comment_id }, { $inc: { likes_count: 1 } })
    },

    decCommentLike: async (comment_id) => {
        await commentscol().updateOne({ id: comment_id }, { $inc: { likes_count: -1 } })
    },

    fetchCommentsByUser: async (on_id, filter, sortBy, revSort, count, pageNum) => {
        let userComments = [];
        let cursor = commentscol().find({
            on_id,
            ...((filter) ?  filter:{})
        }, {
            projection: {
                _id: 0
            },
            skip: (pageNum - 1) * count,
            sort: {
                [sortBy]: revSort ? 1 : -1
            },
            batchSize: 4
        });

        let hasNext = await cursor.hasNext();

        while (hasNext && userComments.length < count) {
            let userComment = await cursor.next();
            userComments.push(userComment);
            hasNext = await cursor.hasNext();
        }

        return {
            hasNext,
            userComments
        }
    }
}