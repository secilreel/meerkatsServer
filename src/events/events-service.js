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
        'title',
        'meeting_day',
        'meeting_time',
        'place',
        'meerkats_users.user_name as owner'
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

  showParticipants(db, id){
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
        'meerkats_users.user_name as owner',
        'user_name as participants',
        'meerkats_participants.attending as status'
      )
      .leftJoin(
        'meerkats_participants', 
        'meerkats_participants.events_id', 
        '=', 
        'meerkats_events.id')
      .leftJoin(
        'meerkats_users', 
        'meerkats_participants.user_id', 
        '=', 
        'meerkats_users.id');
  },

  updateEvent(db, id, participants){
    return db
      .from('meerkats_events')
      .where({id})
      .update(participants)
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
      status: xss(event.status),
      participants: xss(event.participants)
    };
  },

  serializeEvents(events){
    return events.map(this.serializeEvent);
  }
};

module.exports = EventsService;
