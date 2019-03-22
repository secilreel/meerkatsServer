'use strict';
const xss = require('xss');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const bcrypt = require('bcryptjs');

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('meerkats_users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
    
  validatePassword(password) {
      
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
    return null;
  },

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
  },
  
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('meerkats_users')
      .returning('*')
      .then(([user]) => user  );},
      
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },


};

module.exports = UsersService; 