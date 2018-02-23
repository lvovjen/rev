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
  process.env.MAIL_URL = 'smtp://postmaster@sandbox7fbb8738ea5f4f799207cc19b1800eba.mailgun.org:e42a4eb9c59bf4a2495f5159cef923af@smtp.mailgun.org:587'

})
