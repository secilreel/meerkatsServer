'use strict';
const xss = require('xss');

const FriendsService ={
  getById(db, id){
    return db
      .from('meerkats_users')
      .where('id', id)
      .first();
  },

  getAllFriends(db){
    return db
      .from('meerkats_friends')
      .select(
        'meerkats_users.user_name as user_name'
      )
      .innerJoin(
        'meerkats_users', 
        'meerkats_users.id', 
        '=', 
        'meerkats_friends.user_id'
      );
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