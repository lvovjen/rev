
Template.addNewUser.events({
  'submit form': function(event) {
        event.preventDefault();
        var email = event.target.email.value;
        var username = event.target.userName.value;
        var firstName = event.target.firstName.value;
        var lastName = event.target.lastName.value;
        var isAdmin =  event.target.isAdmin.value;
        console.log(isAdmin);
        Meteor.call('createUsers',username,email,firstName,lastName,isAdmin);
  //    Meteor.loginWithPassword(newUserData.email, newUserData.password);
},
'click #backBtn':function(){
  event.preventDefault();
  Router.go('/');
}
})
