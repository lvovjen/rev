Template.override_atPwdFormBtn.replaces('atPwdFormBtn');
Template.override_atPwdFormTitle.replaces('atTitle');
//Template.atPolymerTextInput.replaces("atInput");

Template.navbar.events({
  'click #logout':function(){
	  event.preventDefault();
		Meteor.logout();
		Router.go('loginModal');

  }
})

Template.navbarMobile.events({
  'click #logout':function(){
	  event.preventDefault();
		Meteor.logout();
		Router.go('loginModal');

  }
})


Accounts.onLogin(function() {
Router.go('Feed');
})
