Template.sidebarBoot.onCreated(function() {
/*  Sub = new Mongo.Collection('projects');
  Meteor.subscribe('projects');*/

  this.autorun(() => {
    this.subscribe('projects');
  });
});

Template.sidebarBoot.helpers({
    'project': function(){
      console.log("THe ahasdlasdkjhakjdhakjshd"+Projects.find({userIds: {$in: [Meteor.user()._id]}}).fetch());

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

},
'bdg':function(){
  console.log(Meteor.users.findOne({_id:Meteor.userId()}).badges.length)
  return Meteor.users.findOne({_id:Meteor.userId()}).badges;
}
})


Template.sidebarBoot.events({
  'click.room': function(event) {
    Session.set('currentRoom', this);
    var room = ChatRooms.findOne(this._id);
    Session.set("roomid", this._id);
  },
  'click #project': function(event) {
    Session.set("currentproject", this._id);
  }
});
