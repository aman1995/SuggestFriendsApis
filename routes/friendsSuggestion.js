var express = require('express');
var router = express.Router();
var { Friend } = require('../model/friends');
var { User } = require('../model/users');
var { MESSAGES } = require('../utility/constants');

/* GET suggested friends. */
router.get('/:userA', async function (req, res, next) {
  const user = await User.findOne({ username: req.params.userA });

  //check user exists
  if (!user) {
    res.status(400).send({
      status: MESSAGES.FAILURE,
      reason: MESSAGES.INVALIDINPUT
    });
  } else {

    const query = {
      $or: [
        { 'userA': user._id },
        { 'userB': user._id }
      ]
    }
    const friends = await Friend.find(query).populate('userA').populate('userB');

    let setA = new Set();
    let setB = new Set();
    const responseObj = {
      suggestions: []
    }
    let promisesArr1 = [];
    let promisesArr2 = [];

    setA.add(user.id);
    promisesArr1 = getAllFriends(friends, user, setA);

    Promise.all(promisesArr1).then((arr) => {
      promisesArr2 = getAllFirstLevelSuggestedFriends(arr, setA, setB);
      return promisesArr2;
    })
      .then((promisesArr2) => {
        Promise.all(promisesArr2).then((arr) => {
          getAllSecondLevelSuggestedFriends(arr, setA, setB);
        })
          .then(() => getUsers(setB))
          .then((arr) => {
            Promise.all(arr)
              .then((users) => {
                const userArr = [];
                users.forEach((user) => {
                  userArr.push(user.username);
                })
                if (userArr.length == 0) {
                  res.status(404).send({
                    status: MESSAGES.FAILURE,
                    reason: MESSAGES.INVALIDINPUT
                  });
                } else {
                  responseObj.suggestions = userArr;
                  res.status(200).send(responseObj);
                }
              })
          })
      })
  }
})

function getAllFirstLevelSuggestedFriends(arr, setA, setB) {
  let promisesArr = [];
  arr.forEach((personList) => {
    personList.forEach((person) => {
      id = setA.has(person.userA.id) ? person.userB._id : person.userA._id;
      if (!setA.has(id.toString())) {
        setB.add(id);

        promisesArr.push(Promise.resolve(Friend.find({
          $or: [
            { 'userA': id },
            { 'userB': id }
          ]
        }).populate('userA').populate('userB')));
      }
      setA.add(id.toString());
    });
  });
  return promisesArr;
}

function getAllSecondLevelSuggestedFriends(arr, setA, setB) {
  arr.forEach((personList) => {
    personList.forEach((person) => {
      id = setA.has(person.userA.id) ? person.userB._id : person.userA._id;

      if (!setA.has(id.toString())) {
        setB.add(id);
      }
      setA.add(id.toString());
    })
  })
}

function getAllFriends(friends, user, setA) {
  const promisesArr = [];
  friends.forEach((friend) => {
    id = (friend.userA._id.equals(user._id)) ? friend.userB._id : friend.userA._id;
    promisesArr.push(Promise.resolve(Friend.find({
      $or: [
        { 'userA': id },
        { 'userB': id }
      ]
    }).populate('userA').populate('userB')
    ));
    setA.add(id.toString());
  });
  return promisesArr;
}


function getUsers(set) {
  let promisesArr = [];
  [...set].forEach((e) => {
    promisesArr.push(Promise.resolve(User.findById(e)));
  });
  return promisesArr;
}



module.exports = router;
