'use strict';

const express = require('express');
const path = require('path');
const FriendsService = require('./friends-service');
const { requireAuth } = require('../middleware/jwt-auth');

const friendsRouter = express.Router();
friendsRouter
  .route('/:id')
  .all(requireAuth)
  .get((req,res)=>{
    const db = req.app.get('db');
    console.log('friendsRouter user', req.user);
    let id = req.user.id;
    FriendsService.getAllFriends(db, id)
      .then(friends =>
        res.json(FriendsService.serializeFriends(friends)));
  })
  .get((req,res,next) => {
    FriendsService.searchByUserName(req.params.query)
      .then(friend => {
        res.json(FriendsService.serializeFriend(friend));
      })
      .catch(next);
  });

module.exports = friendsRouter;