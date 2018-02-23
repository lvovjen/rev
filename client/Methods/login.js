Template.override_atPwdFormBtn.replaces('atPwdFormBtn');
Template.override_atPwdFormTitle.replaces('atTitle');
//Template.atPolymerTextInput.replaces("atInput");

Template.navbar.events({
  'click #logout':function(){
    Meteor.logout();
    FlowRouter.go('/login');
  }
})
