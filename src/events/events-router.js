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
    console.log('db')
    EventsService.getAllEvents(req.app.get('db'))
      .then(events => {
        console.log(events)
        res.json(events)
        // res.json(EventsService.serializeEvent(events));
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

    EventsService.insertEvent(
      req.app.get('db'),
      newEvent
    )
      .then(event => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${event.id}`))
          .json(EventsService.serializeEvent(event));
      })
      .catch(next);
  });

module.exports = eventsRouter;
