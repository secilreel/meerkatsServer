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
    EventsService.getAllEvents(req.app.get('db'))
      .then(events => {
        // res.json(events)
        res.json(EventsService.serializeEvents(events));
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { title, details, meeting_day, meeting_time, place, user_id} = req.body;
    const newEvent = { title, details, meeting_day, meeting_time, place, user_id};

    for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

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

eventsRouter
  .route('/:id')
  // .all(requireAuth)
  .get((req,res)=>{
    let id = req.params.id;
    let event = EventsService.getById(id);
    res.json(EventsService.serializeEvent(event));
  });

module.exports = eventsRouter;