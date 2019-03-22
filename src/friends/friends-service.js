'use strict';
const xss = require('xss');

const FriendsService ={
  getById(db, id){
    return db
      .select('id as user_id', 'user_name', 'full_name')
      .from('meerkats_users')
      .where('user_id', id)
      .first();
  },

  getAllFriends(db, id){
    return db
      .select(
        'meerkats_users.user_name as user_name',
        'meerkats_users.full_name as full_name',
        'meerkats_users.image as image',
        'meerkats_friends.friends_id as id'
      )
      .from('meerkats_friends')
      .where('meerkats_friends.user_id',id)
      .leftJoin(
        'meerkats_users', 
        'meerkats_users.id', 
        '=', 
        'meerkats_friends.friends_id'
      );
  },

  searchByUserName(query){
    return db
      .from('meerkats_users')
      .where('user_name','like', `%${query}`)
      .first();
  },

  serializeFriend(user){
    return {
      id:user.id,
      user_name: xss(user.user_name),
      full_name: xss(user.full_name),
      image: user.image
    };
  },
  
  serializeFriends(users){
    return users.map(this.serializeFriend);
  }
};

module.exports = FriendsService;