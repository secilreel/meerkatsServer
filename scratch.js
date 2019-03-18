'use strict';

const bcrypt = require('bcryptjs');

let hash = bcrypt.hashSync('pass1', 8);
console.log(hash);