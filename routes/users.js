var express = require('express');
var router = express.Router();
const {User,validate} = require('../model/users');
var { MESSAGES } = require('../utility/constants');

//Create an User
router.post('/', async function (req, res, next) {
  const result = validate(req.body);
  const dupUser = await User.findOne({ username: req.body.username });

  if (result.error || dupUser) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    let user = new User({
      username: req.body.username,
    });
    await user.save();
    res.status(201).send(user);
  }
});

module.exports = router;
