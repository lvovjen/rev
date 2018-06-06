Template.editUserModal.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
    this.subscribe('allUsers');
  });
});

Template.editUserModal.helpers({
  'fName':function(){
    return Meteor.users.findOne({_id:Session.get('usrMgmt')}).profile.fisrtName;
  },
  'lName':function(){
    return Meteor.users.findOne({_id:Session.get('usrMgmt')}).profile.lastName;
  },
  'username':function(){
    return Meteor.users.findOne({_id:Session.get('usrMgmt')}).username;
  },
  'email':function(){
    return Meteor.users.findOne({_id:Session.get('usrMgmt')}).emails[0].address;
  },
  'projects': function() {
     return  Projects.find({"userIds.user":{$in:[Session.get('usrMgmt')]}}).fetch();
    },
  'isAd':function(){
    return Roles.userIsInRole(Session.get('usrMgmt'), 'admin') ? true : false;
  }
})

Template.editUserModal.events({
    'click #editSaveUsrBtn':function(event,template){
          event.preventDefault();
          var fn = template.find('#firstNameEdit').value;
          var ln = template.find('#lastNameEdit').value;
          var usrn = template.find('#userNameEdit').value;
          var isAd =  template.find('#isAd').checked;
          var reset =  template.find('#resetScore').checked;

          $("#editUserModal").modal("hide");

          Meteor.call('updateUsrProfile',Session.get('usrMgmt'),fn,ln,usrn,isAd);
          if(reset)
          {
            Meteor.call('resetScore',Session.get('usrMgmt'));
          }
    },
    'click #pro': function() {
        // event.preventDefault();
		$("#editUserModal").modal("hide");
		Session.set("currentproject", this._id);    
		}
})
