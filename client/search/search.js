import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';
import {
  Session
} from 'meteor/session'


Tracker.autorun(function() {
  Meteor.subscribe("chatrooms");
  Meteor.subscribe("onlusers");

  let cursor = UsersIndex.search('') // search all docs that contain "Jen" in the name or score field
  /*console.log(cursor.count()) // log count of all found documents*/
});

Template.search.helpers({
  inputAttributes: function() {
    return {
      'class': 'easy-search-input',
      'placeholder': 'Search',
      'noDocumentsOnEmpty': 1
    };
  },
  UsersIndex: () => UsersIndex // instanceof EasySearch.Index
});

Template.search.events({
  'click.user': function() {
    if (Meteor.userId()) {
      if (this._id) {
        Session.set('currentId', this._id);
        var res = ChatRooms.findOne({
          chatIds: {
            $all: [this._id, Meteor.userId()]
          }
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
