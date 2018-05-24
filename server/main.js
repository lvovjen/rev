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
//  process.env.MAIL_URL = 'smtp://postmaster@reviseappweb.com:a8c3580a48f0cea40922c937a01bf5ef-52b1d812-81351cc5@smtp.mailgun.org:2525'
process.env.ROOT_URL = 'http://35.204.250.132:3000';
process.env.MAIL_URL = 'smtp://postmaster@sandbox9a3d410c4e334492a9524f271916a04e.mailgun.org:f52809a5c0fd50f0a2c6bc4c7722d7aa@smtp.mailgun.org:587'
})
