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
       return  Projects.find({"userIds.user":{$in:[Meteor.userId()]}}).fetch();
    },
    'ldrBrd':function(){
      var x =null;
      Meteor.call("getLshpbrd",function(error,result){
      x=result;
      Session.set('ldrbrd',x);
    })
    return Session.get('ldrbrd');
  },
  'levels':function(){
    var x =null;
    Meteor.call("getLevels",function(error,result){
    x=result;
    Session.set('levels',x);
  })
  return Session.get('ldrbrd');
},
'level':function(){
    return Meteor.user.findOne({_id:Meteor.userId()}).level;

}
})

/*Template.sidebarBoot.rendered=function(){
  var x =null;
  Meteor.call("getLshpbrd",function(error,result){
  x=result;
  Session.set('ldrBrd',x);
});*/
