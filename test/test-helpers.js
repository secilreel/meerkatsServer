const bcrypt = require('bcryptjs');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      image: 'http://placehold.it/500x500',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      image: 'http://placehold.it/500x500',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      image: 'http://placehold.it/500x500',
      password: 'password',
    },
  ]
}

function makeEventsArray(users) {
  return [
    {
      id: 1,
      title: 'First test event!',
      details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      meeting_day: '2019-03-12',
      meeting_time: '19:00:00',
      place: 'First test place', 
      date_created: '2029-01-22T16:28:32.615Z',
      event_owner: users[0].id,
    },
    {
      id: 2,
      title: 'Second test event!',
      details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      meeting_day: '2019-03-12',
      meeting_time: '19:00:00',
      place: 'Second test place', 
      date_created: '2029-01-22T16:28:32.615Z',
      event_owner: users[1].id,
    },
    {
        id: 1,
        title: 'Third test event!',
        details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        meeting_day: '2019-03-12',
        meeting_time: '19:00:00',
        place: 'Third test place', 
        date_created: '2029-01-22T16:28:32.615Z',
        event_owner: users[2].id,
    },
  ]
}

function makeParticipantsArray(users, events) {
  return [
    {
      user_id: users[0].id,
      events_id: events[0].id,
      attending: 'pending',
    },
    {
      user_id: users[0].id,
      events_id: events[1].id,
      attending: 'pending',
    },
    {
      user_id: users[1].id,
      events_id: events[1].id,
      attending: 'coming',
    },
    {
      user_id: users[1].id,
      events_id: events[1].id,
      attending: 'pending',
    },
    {
      user_id: users[2].id,
      events_id: events[1].id,
      attending: 'pending',
    },
  ];
}

function makeExpectedEvent(users, event) {
  const user = users
    .find(user => user.id === thing.user_id)

  return {
    id: event.id,
    title: event.title,
    details: event.details,
    date_created: event.date_created,
    meeting_day: event.meeting_day,
    meeting_time: event.meeting_time,
    place: event.place, 
    event_owner: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      image: user.image,
      password: user.password,
    },
  }
}

function makeExpectedEventParticipants(users, eventId, participants) {
  const expectedParticipants = participants
    .filter(participant => participant.events_id === eventId)

  return expectedParticipants.map(participant => {
    const participantUser = users.find(user => user.id === participant.user_id)
    return {
      user: {
        id: participantUser.id,
        user_name: participantUser.user_name,
        full_name: participantUser.full_name,
        image: participantUser.image,
        password: participantUser.password,
      },
      event:{
        id: participantEvent.id,
        title: participantEvent.title,
        details: participantEvent.details,
        date_created: participantEvent.date_created,
        meeting_day: participantEvent.meeting_day,
        meeting_time: participantEvent.meeting_time,
        place: participantEvent.place,
        event_owner: participantEvent.event_owner,
      },
      attending: participant.attending
    }
  })
}

function makeMaliciousEvent(user) {
  const maliciousEvent = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    details: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    date_created: new Date().toISOString(),
    meeting_day: '09/30/2019',
    meeting_time: '19:00:00',
    place: 'Bad place <script>alert("xss");</script>',
    event_owner: user.id,
}
  
  return {
    maliciousEvent,
  }
}

function makeEventsFixtures() {
  const testUsers = makeUsersArray()
  const testEvents = makeEventsArray(testUsers)
  const testParticipants = makeParticipantsArray(testUsers, testEvents)
  return { testUsers, testEvents, testParticipants }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE meerkats_participants IF EXISTS`
  )
}


function seedUsersTable(db, users){
  const preppedUsers=users.map(user=> ({...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db
    .into('meerkats_users')
    .insert(preppedUsers);
}

function seedEventsTable(db, users, events) {
  return seedUsersTable(db, users)
    .then(() =>
      db
        .into('meerkats_events')
        .insert(events)
    )
}

function seedParticipantsTable(db, users, events) {
    return seedUsersTable(db, users)
      .then(() =>
        db
          .into('meerkats_events')
          .insert(events)
      )
      .then(()=>{
        db
        .into('meerkats_participants')
        .insert(events)
      })
  }

function seedMaliciousEvent(db, user, event) {
  return seedUsersTable(db, [user])
    .then(() =>
      db
        .into('meerkats_eventss')
        .insert([event])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET){
  const token = jwt.sign({user_id: user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeEventsArray,
  makeParticipantsArray,
  makeExpectedEvent,
  makeExpectedEventParticipants,
  makeMaliciousEvent,
  makeEventsFixtures,
  cleanTables,
  seedUsersTable,
  seedEventsTable,
  seedParticipantsTable,
  seedMaliciousEvent,
  makeAuthHeader
}
