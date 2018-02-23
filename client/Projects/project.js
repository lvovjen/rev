

/*Template.addProjectModal.events({
  'submit #addUserToProjectFrm':function(event){
    event.preventDefault();
    var role = roleSelect.options[roleSelect.selectedIndex].text;
    var username = userSelect.options[userSelect.selectedIndex].text;

    Meteor.call('updateUserInProject', Session.get('currentproject'), username,role);
  }
})
  'click #submitFrmAddProject': function(event) {
    event.preventDefault();
    var projectname = event.target.projectname.value;
    var descrpition = event.target.projectDescrpition.value;
    Meteor.call('createProject', projectname, descrpition);
  },

  'submit #addUserToProjectFrm':function(event){
    event.preventDefault();
    var projectname = projectSelect.options[projectSelect.selectedIndex].text;
    var username = userSelect.options[userSelect.selectedIndex].text;
    Meteor.call('updateUserInProject', projectname, username);
  },

  'submit #addConversationToProjectFrm': function(event) {
    event.preventDefault();
    var projectname = projectSelectReq.options[projectSelectReq.selectedIndex].text;
    var projId = Projects.findOne({projectname:projectname});
    var descrpition = event.target.reqDescrpition.value;
    var roomName = event.target.requirementName.value;

    Meteor.call('createConversation', projId._id,roomName, descrpition);
}
})*/

Template.addNewProject.helpers({
  'project': function() {
    return Projects.find().fetch();
  },
  'user': function() {
    return Meteor.users.find().fetch();
  }
})
