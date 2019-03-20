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
        'details',
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
        'meerkats_events.event_owner as owner'
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

  updateParticipant(db, id, status){
    return db
      .from('meerkats_events')
      .where('id', id)
      .update({'attending': status})
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
    };
  },

  serializeEvents(events){
    return events.map(this.serializeEvent);
  },

  serializeParticipant(participant){
    return{
      attending: xss(participant.attending),
      user_name: xss(participant.user_name)
    };
  }
};

module.exports = EventsService;
