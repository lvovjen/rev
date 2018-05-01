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
  'admin':function(){
    var x = Meteor.users.find( { "roles": { $in: [admin] } } ).fetch();
    if(x.length>0){
      return true;
    }
    else return false;
  },


})
Template.editUserModal.events({
'click #editSaveUsrBtn':function(event,template){
  event.preventDefault();
  var fn = template.find('#firstNameEdit').value;
  var ln = template.find('#lastNameEdit').value;
  var usrn = template.find('#userNameEdit').value;
console.log(fn, ln, usrn)
  $("#editUserModal").modal("hide");
  Meteor.call('updateUsrProfile',Session.get('usrMgmt'),fn,ln,usrn);
}
})
