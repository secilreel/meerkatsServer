'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router'); 
const eventsRouter = require('./events/events-router');
const usersRouter = require('./users/users-router');
const friendsRouter = require ('./friends/friends-router');
const participantsRouter = require('./participants/participants-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption, {
  skip: () => process.env.NODE_ENV === 'test'
}));
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use('/api', authRouter);
app.use('/api/events', eventsRouter);
// app.use('/api/', participantsRouter);
app.use('/api/users', usersRouter);
app.use('/api/search', friendsRouter);

app.use((req,res,next)=> {
  const authToken = req.get('Authorization');
  if(!authToken || authToken.split(' ')[1] !== process.env.API_TOKEN){
    return res.status(401).send({error: 'Unauthorized'});
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(function ErrorHandler(error, req, res, next) {
  let response;
  if(NODE_ENV === 'production'){
    response = { error: { message: 'server error' } };
  }
  else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
