
Template.addUserModal.events({
  'submit form': function(event,template) {
        event.preventDefault();
        var email = event.target.email.value;
        var username = event.target.userName.value;
        var firstName = event.target.firstName.value;
        var lastName = event.target.lastName.value;
        var pass = event.target.pass.value;
        var isAdmin =  template.find('#isAdmin').checked;
        Meteor.call('createUsers',username,email,firstName,lastName,isAdmin,pass,function(er){
          if(er){
          alert(er);
        }else{
          alert("User added successfully!")

            event.target.email.value = "";
            event.target.userName.value = "";
            event.target.firstName.value = "";
            event.target.lastName.value = "";
            event.target.pass.value = "";
            template.find('#isAdmin').checked = false;

          }
        });
        $("#addUserModal").modal("hide");

  //    Meteor.loginWithPassword(newUserData.email, newUserData.password);
  }
})
