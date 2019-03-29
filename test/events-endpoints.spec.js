const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.skip('Events Endpoints', function() {
  let db

  const {
    testUsers,
    testEvents,
    testParticipants,
  } = helpers.makeEventsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db.raw('truncate table meerkats_users cascade'))

  afterEach('cleanup', () => db('meerkats_participants').truncate())

  describe.skip(`GET /api/events`, () => {

    context('Given there are events in the database', () => {
      beforeEach('insert events', () =>
        helpers.seedEventsTable(
          db,
          testUsers,
          testEvents,
          testParticipants,
        )
      )

      it('responds with 200 and all of the events', () => {
        const expectedEvents = testEvents.map(event =>
          helpers.makeExpectedEvent(
            testUsers,
            event,
            testParticipants,
          )
        )
        return supertest(app)
          .get('/api/things')
          .expect(200, expectedEvents)
      })
    })

    context(`Given an XSS attack thing`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousEvent,
        expectedEvent,
      } = helpers.makeMaliciousEvent(testUser)

      beforeEach('insert malicious event', () => {
        return helpers.seedMaliciousEvent(
          db,
          testUser,
          maliciousThing,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/events`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedEvent.title)
            expect(res.body[0].details).to.eql(expectedEvent.details)
            expect(res.body[0].place).to.eql(expectedEvent.place)
          })
      })
    })
  })

  describe.skip(`GET /api/events/:event_id`, () => {

    context('Given there are events in the database', () => {
      beforeEach('insert events', () =>
        helpers.seedEventsTables(
          db,
          testUsers,
          testEvents,
          testParticipants,
        )
      )

      it('responds with 200 and the specified event', () => {
        const eventId = 2
        const expectedEvent = helpers.makeExpectedEvent(
          testUsers,
          testEvents[eventId - 1],
          testParticipants,
        )

        return supertest(app)
          .get(`/api/events/${eventId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(expectedEvent.title)
            const actualDate = new Date(res.body.date_created).toLocaleString();
            const expectedDate = new Date(expectedThing.date_created).toLocaleString('en', {timeZone: 'UTC'})
          expect(actualDate).to.equal(expectedDate);
      })
    })
  })
})
})
