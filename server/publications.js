Meteor.publish("chatrooms",function(){
  return ChatRooms.find({});
})
Meteor.publish("onlusers",function(){
  return Meteor.users.find({"status.online":true},{username:1});
})
Meteor.publish("allUsers",function(){
  return Meteor.users.find({});
})
Meteor.publish("projects",function(){
  return Projects.find({});
})
Meteor.publish("general",function(){
  return General.find({});
})
