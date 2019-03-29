'use strict';

const express = require('express');
const path = require('path');
const EventsService = require('./events-service.js');
const { requireAuth } = require('../middleware/jwt-auth');

const eventsRouter = express.Router();
eventsRouter
  .route('/')
  .all(requireAuth)
  .get((req,res,next) => {
    EventsService.getAllEvents(req.app.get('db'))
      .then(events => {
        res.json(EventsService.serializeEvents(events));
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const event_owner = req.user.id;
    const { title, details, meeting_day, meeting_time, place} = req.body;
    const newEvent = { title, details, meeting_day, meeting_time, place, event_owner};
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
  .all(requireAuth)
  .get((req,res)=>{
    const db = req.app.get('db');
    let id = req.params.id;
    EventsService.showEventDetails(db, id)
      .then(event => 
        res.json(EventsService.serializeEvent(event)));
  })
  .delete((req,res) =>{
    const db = req.app.get('db');
    EventsService.deleteEvent(db, req.params.id)
      .then(() => res.json(204).end());
  });

eventsRouter
  .route('/:id/participants')
  .all(requireAuth)
  .get((req,res)=>{
    const db = req.app.get('db');
    let id = req.params.id;
    EventsService.showParticipant(db, id)
      .then(participants => {
        let results = participants.map(participant => EventsService.serializeParticipant(participant));
        res.json(results);
      });
  })
  .post((req, res, next) => {
    let id = parseInt(req.params.id, 10);
    const db = req.app.get('db');
    const participants = req.body;
    if(!participants.length){
      EventsService.insertParticipant(
        db, 
        id,
        participants
      )
        .then(participant => {
          res
            .status(201)
            .json(EventsService.serializeParticipants(participant));
        })
        .catch(next);
  
    }
    else {
      EventsService.insertParticipants(
        db, 
        id,
        participants
      )
        .then(participants => {
          res
            .status(201)
            .json(EventsService.serializeParticipants(participants));
        })
        .catch(next);
    }
  });


eventsRouter
  .route('/:event_id/participants/:par_id')
  .all(requireAuth)
  .patch((req,res) =>{
    const db = req.app.get('db');
    const par_id = req.user.id;
    //check req.body exists and it's a valid value
    EventsService.updateParticipant(
      db, req.params.event_id, par_id, req.body.attending)
      .then((participant) =>{
        res.json(EventsService.serializeParticipant(participant));
      });
  });

module.exports = eventsRouter;
