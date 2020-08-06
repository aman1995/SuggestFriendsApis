var express = require('express');
var router = express.Router();
var { Request, validate } = require('../model/request');
var { User } = require('../model/users');
var { Friend } = require('../model/friends');
var { MESSAGES } = require('../utility/constants');

//Send request from A to B
router.post('/:userA/:userB', async function (req, res, next) {
  const result = validate(req.params);
  const userA = await User.findOne({ username: req.params.userA });
  const userB = await User.findOne({ username: req.params.userB });


  //check user exists
  if (result.error || !userA || !userB) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    const query = {
      $or: [
        { userA: userA._id, userB: userB._id },
        { userB: userA._id, userA: userB._id }
      ]
    }
    const dupRequest = await Request.findOne({ from: userA._id, to: userB._id });
    const friendExist = await Friend.findOne(query);
    //check duplicate request
    if (dupRequest || friendExist) {
      res.status(400).send({
        status: MESSAGES.FAILURE,
        reason: MESSAGES.INVALIDINPUT
      });
    }
    else {
      // check to add friend
      const reqBtoA = await Request.findOne({ from: userB._id, to: userA._id });
      if (reqBtoA) {
        let friend = new Friend({
          userA: userA._id,
          userB: userB._id,
        });
        await friend.save();
        await Request.findByIdAndDelete({_id:reqBtoA._id});
      }
      else {
        let request = new Request({
          from: userA._id,
          to: userB._id,
        });

        await request.save();
      }
      res.status(202).send({
        status: "success"
      });
    }
  }
});


//Send request from A to B
router.get('/:userA', async function (req, res, next) {
  const user = await User.findOne({ username: req.params.userA });

  //check user exists
  if (!user) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    const pendingRequest = await Request.find({ to: user._id }).populate('from');

    if (pendingRequest.length == 0) {
      res.status(404).send({
        status: MESSAGES.FAILURE,
        reason: MESSAGES.INVALIDINPUT
      });
    } else {
      const responseObj = [];
      pendingRequest.forEach((request) => {
        responseObj.push(request.from.username);
      });
      res.status(200).send({
        friend_requests : responseObj
      });
    }
  }
});

module.exports = router;
