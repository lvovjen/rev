Template.sidebarBoot.onCreated(function() {
/*  Sub = new Mongo.Collection('projects');
  Meteor.subscribe('projects');*/

  this.autorun(() => {
    this.subscribe('projects');
  });
});

/*Template.mainNav.events({
  'click.login-toggle':()=>{
    Session.set('nav-toggle','open')
  },
  'click.logout':()=>{
    AccountsTemplates.logout();
  }
})
*/
Template.sidebarBoot.helpers({
    'project': function(){
       return  Projects.find().fetch();
    }
})
