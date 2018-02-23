import { Index, MinimongoEngine } from 'meteor/easy:search'
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';


// On Client and Server
export const Users = Meteor.users;
/***const UsersIndex = new EasySearch.Index({
  collection: Users,
  fields: ['username', 'email'],
  engine: new MinimongoEngine(),
})*/

UsersIndex = new EasySearch.Index({
  collection: Users,
  fields: ['username', 'email'],
  engine: new MinimongoEngine(),
  defaultSearchOptions: {
    limit:3
  }
})
