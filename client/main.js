import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';
import {
  Session
} from 'meteor/session'

Template.sidebar.helpers({
  'onlusr': function() {
    return Meteor.users.find({
      "status.online": true,
      _id: {
        $ne: Meteor.userId()
      }
    });
  }
});

/*
Template.main_template.helpers({
  currentUser: function() {
    return Meteor.userId();
  }
})


Template.sidebar.events({
  'click.user': function() {
    if (Meteor.userId()) {
      if (this._id) {
        Session.set('currentId', this._id);
        var res = ChatRooms.findOne({chatIds: {$all: [this._id, Meteor.userId()]}
        });
        if (res) {
          //already room exists
          Session.set("roomid", res._id);
        } else {
          //no room exists
          var newRoom = ChatRooms.insert({
            chatIds: [this._id, Meteor.userId()],
            messages: [],
            roomName: null
          });
          Session.set('roomid', newRoom);
        }
      }
    }
  }
});
*/
