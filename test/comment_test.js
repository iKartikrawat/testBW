const { initDb, stopDb } = require("../db/database");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let expect = chai.expect;
const { User } = require("./helper/user");
const create_user = require("../routes/user/create_user");
const { ValidationError } = require("../helper/custom_error");
const { fetchUserById } = require("../model/user_model");
const { UserComment } = require("./helper/user_comment");
const create_comment = require("../routes/comment/create_comment");
const { hasLiked } = require("../model/like_model");
const like_comment = require("../routes/comment/like_comment");
const fetch_comment = require("../routes/comment/fetch_comment");

describe('Comments', function () {
    ////to initialise db
    before(async function () {
        await initDb();
    })
    after(async function () {
        await stopDb();
    })

    let userA = new User();
    let userB = new User();

    before(async function () {
        userA.setName("testUserA");
        userB.setName("testUserB");
        userA.setId(await create_user(userA.toJson()))
        userB.setId(await create_user(userB.toJson()))
    })

    let getLikeReq = (by_id, comment_id, like) => ({
        by_id,
        comment_id,
        like
    });

    let getFetchReq = (user_id, on_id, filter, sortBy, revSort, count, pageNum) => ({
        user_id,
        on_id,
        filter,
        sortBy,
        revSort,
        count,
        pageNum
    });

    describe('#createComment()', function () {

        describe('should throw Validation Error only if data missing', function () {

            it('should throw Validation Error if title is not present', function () {
                let comment = new UserComment().setOnId(userA.id).setById(userB.id).setDescription("desc").toJson();
                return expect(create_comment(comment)).to.eventually.be.rejected.and.instanceOf(ValidationError)
            });
            it('should throw Validation Error if description is not present', function () {
                let comment = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("Title").toJson();
                return expect(create_comment(comment)).to.eventually.be.rejected.and.instanceOf(ValidationError)
            });
            it('should throw Validation Error if on_id is not present', function () {
                let comment = new UserComment().setById(userA.id).setTitle("Title").setDescription("desc").toJson();
                return expect(create_comment(comment)).to.eventually.be.rejected.and.instanceOf(ValidationError)
            });
            it('should throw Validation Error if by_id is not present', function () {
                let comment = new UserComment().setOnId(userA.id).setTitle("Title").setDescription("desc").toJson();
                return expect(create_comment(comment)).to.eventually.be.rejected.and.instanceOf(ValidationError)
            });

            it('should not throw error if title,description,by_id,on_id are present and return inserted comment id', function () {
                let comment = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc").toJson();
                return expect(create_comment(comment)).to.eventually.be.a("number")
            });
        })
    });

    describe('#likeUnlikeComment()', function () {
        let comment = new UserComment();


        before(async function () {
            comment.setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc")
            comment.setId(await create_comment(comment.toJson()))
        })

        it('should set hasLiked true when liked', async function () {
            let req = getLikeReq(userA.id, comment.id, true)
            await like_comment(req);
            return expect(hasLiked(comment.id, userA.id)).to.eventually.equal(true);
        })

        it('should set hasLiked false when unliked', async function () {
            let req = getLikeReq(userA.id, comment.id, false)
            await like_comment(req);
            return expect(hasLiked(comment.id, userA.id)).to.eventually.equal(false);
        })
    });

    describe('#fetchComments()', function () {
        /* before(async function () {
            comment.setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc")
            comment.setId(await create_comment(comment.toJson()))
        }) */
        it('should return empty array if no comments are present', async function () {
            let req = getFetchReq(userA.id, userB.id, null, "RECENT", false, 10, 1);
            let result = await fetch_comment(req);
            return expect(result.hasNext == false && result.userComments.length == 0).to.equal(true)
        })

        it('should return comments if present with most recent first', async function () {
            let comment = new UserComment().setOnId(userB.id).setById(userA.id).setTitle("title").setDescription("desc");
            comment.id = await create_comment(comment.toJson())
            let req = getFetchReq(userA.id, userB.id, null, "RECENT", false, 10, 1);
            let result = await fetch_comment(req);
            return expect(result.userComments[0].id).to.equal(comment.id)
        })

        it('should return hasNext true if more than count', async function () {
            {
                let promisesArr = []
                for (let i = 0; i < 10; i++) {
                    let comment = new UserComment().setOnId(userB.id).setById(userA.id).setTitle("title").setDescription("desc");
                    promisesArr.push(create_comment(comment.toJson()));
                }
                await Promise.all(promisesArr);
            }
            let req1 = getFetchReq(userA.id, userB.id, null, "RECENT", false, 10, 1);
            let result1 = await fetch_comment(req1);
            let req2 = getFetchReq(userA.id, userB.id, null, "RECENT", false, 11, 1);
            let result2 = await fetch_comment(req2);
            return expect(result1.hasNext == true && result2.hasNext == false).to.equal(true)
        });

        it('should sort based on likes', async function () {
            let comment1 = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc");
            comment1.id = await create_comment(comment1.toJson());
            let comment2 = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc");
            comment2.id = await create_comment(comment2.toJson());

            await Promise.all([
                await like_comment(getLikeReq(userA.id, comment1.id, true)),
                await like_comment(getLikeReq(userB.id, comment2.id, true)),
                await like_comment(getLikeReq(userA.id, comment2.id, true))
            ])

            let req = getFetchReq(userB.id, userA.id, null, "BEST", false, 10, 1);
            let result = await fetch_comment(req);
            console.log(result);
            return expect(result.userComments[0].id == comment2.id && result.userComments[1].id == comment1.id).to.equal(true);
        });

        it('should sort reverse if revSort true', async function () {
            let req = getFetchReq(userB.id, userA.id, null, "BEST", true, 10, 1);
            let { userComments } = await fetch_comment(req);

            return expect(
                userComments[userComments.length - 1].likes_count > userComments[userComments.length - 2].likes_count
            ).to.equal(true);
        });

        it('should filter based on filters', async function () {

            let commentMbti = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc").setMbti("INTJ");
            let commentZodiac = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc").setZodiac("Aries");
            let commentEnneagram = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc").setEnneagram("1w2");
            commentMbti.id = await create_comment(commentMbti.toJson());
            commentZodiac.id = await create_comment(commentZodiac.toJson());
            commentEnneagram.id = await create_comment(commentEnneagram.toJson());

            let reqMbti = getFetchReq(userB.id, userA.id, "MBTI", "BEST", false, 10, 1);
            let resultMbti = await fetch_comment(reqMbti);
            let reqZodiac = getFetchReq(userB.id, userA.id, "ZODIAC", "BEST", false, 10, 1);
            let resultZodiac = await fetch_comment(reqZodiac);
            let reqEnneagram = getFetchReq(userB.id, userA.id, "ENNEAGRAM", "BEST", false, 10, 1);
            let resultEnneagram = await fetch_comment(reqEnneagram);

            return expect(
                resultMbti.userComments.length == 1 &&
                resultMbti.userComments[0].id == commentMbti.id &&
                resultZodiac.userComments.length == 1 &&
                resultZodiac.userComments[0].id == commentZodiac.id &&
                resultEnneagram.userComments.length == 1 &&
                resultEnneagram.userComments[0].id == commentEnneagram.id
            ).to.be.equal(true)
        });

        it('should paginate correctly', async function () {

            let comment1 = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc")
            let comment2 = new UserComment().setOnId(userA.id).setById(userB.id).setTitle("title").setDescription("desc")
            comment1.id = await create_comment(comment1.toJson());
            comment2.id = await create_comment(comment2.toJson());

            let reqPage1 = getFetchReq(userB.id, userA.id, null, "RECENT", false, 1, 1);
            let resultPage1 = await fetch_comment(reqPage1);
            let reqPage2 = getFetchReq(userB.id, userA.id, null, "RECENT", false, 1, 2);
            let resultPage2 = await fetch_comment(reqPage2);

            return expect(
                resultPage1.userComments[0].id==comment2.id&&
                resultPage2.userComments[0].id==comment1.id
            ).to.be.equal(true)
        });
    });
});
