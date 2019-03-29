const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.skip('Auth Endpoints', function() {
  let db

  const { testUsers } = helpers.makeEventsFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean tables', () => helpers.cleanTables())

  afterEach('cleanup', () => helpers.cleanTables())

  context(`POST /api/login`, () => {
   
    beforeEach('insert users', () =>
      helpers.seedUsersTable(
        db,
        testUsers,
      )
    ) 

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
    const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password,
    }
    const expectedToken = jwt.sign(
        { user_id: testUser.id }, 
        process.env.JWT_SECRET,
        {
        subject: testUser.user_name,
        expiresIn: process.env.JWT_EXPIRY,
        algorithm: 'HS256',
        }
    )
    return supertest(app)
        .post('/api/login')
        .send(userValidCreds)
        .expect(200, {
        authToken: expectedToken,
        })
    })

    })
  })