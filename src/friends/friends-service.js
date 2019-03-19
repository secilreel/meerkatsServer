'use strict';
const xss = require('xss');

const FriendsService ={
  getById(db, id){
    return db
      .from('meerkats_users')
      .where('id', id)
      .first();
  },

  searchByUserName(userName){
    return db
      .from('meerkats_users')
      .where('user_name', userName)
  }
};

module.exports = FriendsService;