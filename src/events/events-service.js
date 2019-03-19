'use strict';
const xss = require('xss');

const EventsService = {
  getById(db, id) {
    return db
      .from('meerkats_events')
      .where('id', id)
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
        // 'user_name'
      )
      // .where('event_owner', 'user.id')
      // .leftJoin(
      //   'meerkats_users as owner',
      //   'user.user_name'
      // );
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
      event_owner: xss(event.event_owner)
    };
  },

  serializeEvents(events){
    return events.map(this.serializeEvent);
  }
};

module.exports = EventsService;
