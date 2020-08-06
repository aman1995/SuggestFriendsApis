var express = require('express');
var router = express.Router();
var { Friend } = require('../model/friends');
var { User } = require('../model/users');
var { MESSAGES } = require('../utility/constants');

/* GET All friends of user. */
router.get('/:userA', async function(req, res, next) {
  
  const user = await User.findOne({ username: req.params.userA });

  //check user exists
  if (!user) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  }
  else {
    const query={
      $or:[
        {userA: user._id},
        {userB: user._id}
      ]
    }
    const friends = await Friend.find(query).populate('userA').populate('userB');
    
    if(friends.length == 0){
      res.status(404).send({
        status: MESSAGES.FAILURE,
        reason: MESSAGES.INVALIDINPUT
      });
    }else{
      const responseObj = [];
      friends.forEach((friend)=>{
        responseObj.push(friend.userA.username == user.username ? 
                            friend.userB.username : friend.userA.username);
      });
      res.status(200).send({
        friends:responseObj
      });
    }
  }

});

module.exports = router;
