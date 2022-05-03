const router = require('express').Router();
const { fetchUserById } = require('../../model/user_model');
const { jsonPostReq } = require('../../sandboxenv/requestsEnv');

module.exports = function () {

  router.post('/', jsonPostReq(require('./create_user')));


  ////regex to limit userId to 11 digits max.
  router.get('/:profileId(\\d{1,11})', async (req, res) => {
    try {
      let user = await fetchUserById(Number(req.params.profileId));

      if (user)
        res.render('profile_template', {
          profile: user
        });
      else
        res.status(404).json("User Not Found!");
    }
    catch (error) {
      res.status(500).json("Something Went Wrong!!");
    }
  });
  return router;
}

