Template.sidebarBoot.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});

/*Template.navbar.helpers({
  'levels':function(){
    return Session.get('levels');
  }
});*/


Template.sidebarBoot.helpers({
    'ifProjects': function(){
      var projects = Projects.find({"userIds.user":{$in:[Meteor.userId()]}}).fetch();
      if(projects.length>0){
       return true;
     }else{
       return false;
     }
    },
  'project': function(){
      return projects = Projects.find({"userIds.user":{$in:[Meteor.userId()]}}).fetch();
     },
    'Allproject':function(){
      if(Roles.userIsInRole(Meteor.userId(),'admin')){
          return  Projects.find({}).fetch();
      }
    },
   'ledrBrd':function(){
      return Session.get('ldrbrd');
    },
    'levels':function(){
      return Session.get('levels');
    },
    'badges':function(){
      return Session.get('badges');
    },
    'c1':function(){
          if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge1"}).fetch().length == 0){
          return false;
        }
    return true;
    },
    'c2':function(){
          if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge2"}).fetch().length == 0){
          return false;
        }
      return true;
    },
    'c3':function(){
          if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge3"}).fetch().length == 0){
          return false;
        }
    return true;
    },
    'c4':function(){
          if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge4"}).fetch().length == 0){
          return false;
        }
    return true;
  },
  'act':function(){
    return this.active;
  }
})


Template.sidebarBoot.events({
  'click #project': function(event) {
    Session.set("currentproject", this._id);
  }
});
