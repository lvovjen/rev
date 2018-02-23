Template.sidebarBoot.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});

Template.sidebarBoot.helpers({
  'project': function() {
//    console.log(Projects.find({userIds: {$in: [Meteor.user()._id]}}).fetch());
    return Projects.find({userIds: {$in: [Meteor.user()._id]}}).fetch();
  },
  'req':function(){
    return ChatRooms.find({}).fetch();
  },
  'firstName': function() {
     return Meteor.user().profile.fisrtName;
   },
   'lastName': function() {
      return Meteor.user().profile.lastName;
    }
});

Template.sidebarBoot.events({
  'click.room': function(event) {
    Session.set('currentRoom', this);
    var room = ChatRooms.findOne(this._id);
    Session.set("roomid", this._id);
  },
  'click #project': function(event) {
    Session.set("currentproject", this._id);
  }
});
