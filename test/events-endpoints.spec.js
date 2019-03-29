const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Events Endpoints', function() {
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

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/events`, () => {

    context('Given there are events in the database', () => {
      beforeEach('insert events', () =>
        helpers.seedUsersTable(
          db,
          testUsers,
        )
      )

      it('responds with 200 and all of the events', () => {

        const testEvent = testEvents[0]

        return supertest(app)
          .post('/api/login')
          .set('Accept', 'application/json')
          .send({user_name: 'meerkat', password: 'pass1'})
          .expect('Content-Type', /json/)
          .then(res => {
              return supertest(app)
              .get('/api/events')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .auth('bearer', res.authToken)
          })
          .expect(200)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.title).to.eql(testEvents[0].title)
            expect(res.body.details).to.eql(testEvents[0].details)
            expect(res.body.meeting_day).to.eql(testEvents[0].meeting_day)
            expect(res.body.meeting_time).to.eql(testEvents[0].meeting_time)
            expect(res.body.place).to.eql(testEvents[0].place)
            expect(res.body.event_).to.eql(testEvents[0].meeting_day)
            expect(res.headers.location).to.eql(`/api/events/${res.body.id}`)
            const expectedDate = new Date().toLocaleString()
            const actualDate = new Date(res.body.date_created).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
      })
    })
})
})
