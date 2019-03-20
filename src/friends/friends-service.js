'use strict';
const xss = require('xss');

const FriendsService ={
  getById(db, id){
    return db
      .from('meerkats_users')
      .where('id', id)
      .first();
  },

  searchByUserName(query){
    return db
      .from('meerkats_users')
      .where('user_name','like', `%${query}`)
      .first();
  },

  serializeUser(user){
    return {
      id: user.id,
      user_name: xss(user.user_name),
      full_name: xss(user.full_name)
    };
  },
  
  serializeUsers(users){
    return users.map(this.serializeUser);
  }
};

module.exports = FriendsService;