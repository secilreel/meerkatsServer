'use strict';
const xss = require('xss');

const EventsService = {
  getById(db, id) {
    return db
      .from('meerkats_events')
      .select(
        'title',
        'details',
        'meeting_day',
        'meeting_time',
        'place',
        'user_id')
      .where('event.id', id)
      .first();
  },

  insertEvent(db, newEvent) {
    return db
      .insert(newEvent)
      .into('meerkats_events')
      .returning('*')
      .then(([event]) => event)
      .then(event =>
        EventsService.getById(db, event.id)
      );
  },

  serializeEvent(event) {
    return {
      id: event.id,
      title: xss(event.title),
      details: xss(event.details),
      meeting_day: xss(event.meeting.day),
      meeting_time: xss(event.meeting.time),
      place: xss(event.place),
      user_id: event.user_id
    };
  }
};

module.exports = EventsService;
