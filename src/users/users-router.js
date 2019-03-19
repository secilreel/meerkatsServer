'use strict';

const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router();

usersRouter
  .route('/')
  // .all(requireAuth)
  .get((req,res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(users =>
        res.json(UsersService.serializeUsers(users));
  })
  .catch(next);