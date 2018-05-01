import {
  Meteor
} from 'meteor/meteor';

/*Meteor.startup(() => {
  // code to run on server at startup
});*/

Meteor.startup(function() {
  ChatRooms.allow({
    'insert': function(username, doc) {
      return true;
    },
    'update': function(username, doc, fieldNames, modifier) {
      return true;
    },
    'remove': function(username, doc) {
      return false;
    }
  })
  process.env.MAIL_URL = 'smtp://postmaster@reviseappweb.com:a8c3580a48f0cea40922c937a01bf5ef-52b1d812-81351cc5@smtp.mailgun.org:587'
  process.env.ROOT_URL = 'http://mydomain.com:3000';
})
