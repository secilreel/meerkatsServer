
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Participants Endpoints', function() {
  let db

  const {
    testEvents,
    testUsers,
    testParticipants
  } = helpers.makeEventsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean tables', () => {
    db.raw('truncate table meerkats_users cascade')
  })

  afterEach('cleanup', () => db.raw('truncate table meerkats_users cascade'))

  context(`POST /api/events`, () => {
    
    beforeEach('insert events', () =>
      helpers.seedEventsTable(
        db,
        testUsers,
        testEvents,
      )
    )

    it(`creates an event, responding with 201 and the new participant`, function() {
      this.retries(3)
      const testEvent = testEvents[0]
      const testUser = testUsers[0]
      const newParticipant = {
        user_id: testUser.id,
        events_id: testEvent.id,
        attending: 'coming',
      }
      return supertest(app)
        .post('/api/events')
        .send(newEvent)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.attending).to.eql(newParticipant.attending)
          expect(res.body.events_id).to.eql(newParticipant.events_id)
          expect(res.body.user_id).to.eql(newParticipant.id)
          expect(res.headers.location).to.eql(`/api/events/${res.body.id}`)
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('meerkats_participants')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.attending).to.eql(newParticipant.attending)
              expect(row.events_id).to.eql(newParticipant.events_id)
              expect(row.user_id).to.eql(newParticipant.user_id)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })
    })
  })
