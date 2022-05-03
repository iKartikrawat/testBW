const router = require('express').Router();
const { jsonPostReq } = require('../../sandboxenv/requestsEnv');

module.exports = function () {

  router.post('/', jsonPostReq(require('./create_comment')));

  router.post('/fetch', jsonPostReq(require('./fetch_comment')));
  
  router.post('/like', jsonPostReq(require('./like_comment')));

  return router;
}

