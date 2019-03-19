'use strict';
const xss = require('xss');

const UsersService = {
  getById(db, id){
    return db
      .from('meerkats_users')
      .where('id', id)
      .first();
  },

  getAllUsers(db){
    return db
      .from('meerkats_users')
      .select(
        'user_name',
        'full_name'
      );
  },

  serializeUser(user){
    return{
      id: user.id,
      user_name: xss(user.user_name),
      full_name: xss(user.full_name)
    };
  },

  serializeUsers(users){
    return users.map(this.serializeUser);
  }
};

module.exports = UsersService; 