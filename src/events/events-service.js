'use strict';
const xss = require('xss');

const EventsService = {
  getById(db, id) {
    return db
      .from('meerkats_events')
      .where('meerkats_events.id', id)
      .first();
  },

  getAllEvents(db){
    return db
      .from('meerkats_events')
      .select(
        'meerkats_events.id',
        'title',
        'details',
        'meeting_day',
        'meeting_time',
        'place',
        'meerkats_users.user_name as owner',
        'meerkats_users.image as image'
      )
      .innerJoin(
        'meerkats_users', 
        'meerkats_users.id', 
        '=', 
        'meerkats_events.event_owner');
  },

  deleteEvent(db, id){
    return db
      .from('meerkats_events')
      .where('id', id)
      .delete();
  },

  showEventDetails(db, id){
    return db
      .from('meerkats_events')
      .where('meerkats_events.id', id)
      .first()
      .select(
        'meerkats_events.title',
        'details',
        'meeting_day',
        'meeting_time',
        'place',
        'meerkats_events.event_owner as owner',
        'meerkats_users.image as image'
      )
      .innerJoin(
        'meerkats_users', 
        'meerkats_users.id', 
        '=', 
        'meerkats_events.event_owner');
  },

  showParticipant(db, id){
    return db
      .select('*')
      .from('meerkats_participants')
      .where('events_id', id)
      .innerJoin(
        'meerkats_users', 
        'meerkats_participants.user_id', 
        '=', 
        'meerkats_users.id');
  },

  insertParticipant(db, id, newParticipant) {
    return db
      .insert(newParticipant)
      .into('meerkats_participants')
      .where('events_id', id)
      .returning('*')
      .then(() => console.log(newParticipant));
      // .then(() =>{
      //   console.log(newParticipant);
      //   return EventsService.getById(db, id);
      // });
  },

  insertParticipants(participants){
    participants.map(this.insertParticipant);
  },

  updateParticipant(db, event_id, par_id, attending){
    return db
      .from('meerkats_participants')
      .where('events_id', event_id)
      .where('user_id', par_id)
      .update('attending', attending)
      .returning('*');
  },

  insertEvent(db, newEvent) {
    return db
      .insert(newEvent)
      .into('meerkats_events')
      .returning('*')
      .then(([event]) => event)
      .then(event =>{
        return EventsService.getById(db, event.id);
      });
  },

  serializeEvent(event) {
    return {
      id: event.id,
      title: xss(event.title),
      details: xss(event.details),
      meeting_day: xss(event.meeting_day),
      meeting_time: xss(event.meeting_time),
      place: xss(event.place),
      event_owner: xss(event.owner),
      image: xss(event.image)
    };
  },

  serializeEvents(events){
    return events.map(this.serializeEvent);
  },

  serializeParticipant(participant){
    const resultObject = {};
    resultObject.user_id=participant.user_id;
    resultObject.image=participant.image;
    if (participant.user_name) resultObject.user_name=xss(participant.user_name);
    if (participant.attending) resultObject.attending=xss(participant.attending);
    return resultObject;
  }
};

module.exports = EventsService;
