'use strict';
const xss = require('xss');

const UsersService ={
  getById(db, id){
    return db
      .from('meerkats_users')
      .where('users.id', id)
      .first();
  },

  getAllThings(db){
    return db
      .from('meerkats_users')
      .select(
        'user_name'
      );
  },

  insertUser(db, newUser)


};

module.exports = UsersService; 