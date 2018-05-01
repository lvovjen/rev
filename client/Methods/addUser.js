
Template.addUserModal.events({
  'submit form': function(event,template) {
        event.preventDefault();
        var email = event.target.email.value;
        var username = event.target.userName.value;
        var firstName = event.target.firstName.value;
        var lastName = event.target.lastName.value;
        var isAdmin =  template.find('#isAdmin').checked;
        console.log(isAdmin);
        Meteor.call('createUsers',username,email,firstName,lastName,isAdmin);
  //    Meteor.loginWithPassword(newUserData.email, newUserData.password);
}
})
