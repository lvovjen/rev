Template.sidebarBoot.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});


Template.profileModal.helpers({
'u':function(){
  return Meteor.users.findOne({_id:Meteor.userId()});
},
    'userEmail': function() {
      return Meteor.user().emails[0].address;
    },
    'project': function() {
      return Meteor.users.findOne({_id:Meteor.userId()}).projects;
    }
});
