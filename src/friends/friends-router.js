'use strict';

const express = require('express');
const path = require('path');
const FriendsService = require('./friends-service');
const { requireAuth } = require('../middleware/jwt-auth');

const friendsRouter = express.Router();
friendsRouter
  .route('/')
  // .all(requireAuth)
  .get((req,res,next)=>{
    FriendsService.getAllFriends(req.app.get('db'))
      .then(friends =>
        res.json(FriendsService.serializeFriends(friends)))
  })
  .get((req,res,next) => {
    FriendsService.searchByUserName(req.params.query)
      .then(friend => {
        res.json(FriendsService.serializeFriend(friend));
      })
      .catch(next);
  });

module.exports = friendsRouter;