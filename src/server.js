'use strict';

const app = require('./app');
const { DB_URL, PORT } = require('./config');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

app.set('db',db);

app.get('/api', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () =>{
  console.log(`Server listening at http://localhost:${PORT}`);
});