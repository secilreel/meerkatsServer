'use strict';

const express = require('express');
const UsersService = require('./users-service');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router();

usersRouter
  .route('/')
  // .all(requireAuth)
  .get((req,res,next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(users => {
        res.json(UsersService.serializeUsers(users));
      })
      .catch(next);
  });

usersRouter
  .route('/:id')
  // .all(requireAuth)
  .get((req,res) => {
    const db = req.app.get('db');
    let id = req.params.id;
    UsersService.getById(db,id)
      .then(user =>
        res.json(UsersService.serializeUser(user)));
  });

module.exports = usersRouter;