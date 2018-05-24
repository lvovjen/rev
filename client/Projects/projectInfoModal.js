Template.projectInfoModal.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
    this.subscribe('allUsers');
    this.subscribe('chatrooms');

  });
});

Template.projectInfoModal.helpers({
  'projName':function(){
    return Projects.findOne({_id: Session.get('currentproject')}).projectname;
  },
  'projDesc':function(){
    return Projects.findOne({_id: Session.get('currentproject')}).descrpition;
  },
  'numOfReqs':function(){
    return Projects.findOne({_id: Session.get('currentproject')}).reqNum;
  },
  'users':function(){
    return Projects.findOne({_id: Session.get('currentproject')}).userIds;
  },
  'username':function(){
    return Meteor.users.findOne({_id:this.user}).username;
  },
  'reqs':function(){
    return ChatRooms.find({project:Session.get('currentproject')}).fetch();
    }
})
