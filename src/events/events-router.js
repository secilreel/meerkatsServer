'use strict';

const express = require('express');
const path = require('path');
const EventsService = require('./events-service.js');
const { requireAuth } = require('../middleware/jwt-auth');

const eventsRouter = express.Router();

eventsRouter
  .route('/')
  // .all(requireAuth)
  .get((req,res, next) => {
    EventsService.getAllThings(req.app.get('db'))
      .then(things => {
        res.json(EventsService.serializeThings(things))
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { event_id, title, details, meeting_day, meeting_time, place, user_id} = req.body;
    const newEvent = { event_id, title, details, meeting_day, meeting_time, place, user_id};

    for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newEvent.user_id = req.user.id;

    EventsService.insertReview(
      req.app.get('db'),
      newEvent
    )
      .then(review => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(EventsService.serializeReview(review));
      })
      .catch(next);
  });

module.exports = eventsRouter;
