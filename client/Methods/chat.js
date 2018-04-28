Template.sidebarBoot.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chatrooms');
    this.subscribe('projects');
      });

});

Template.chat_template.onRendered(function () {
console.log("im on render")
});

/*Template.singleMessage.helpers({
  timestampFixed: function() {
    return moment(this.timestamp).format('h:mm a');
  }
});*/
Template.chat_template.helpers({
'req': function() {
  var temp = Projects.findOne({_id:Session.get("currentproject")}).requests;
  return temp;
},
'compR':function(){
  return this.completed;
},
'newmsgs':function(){
  return Subscriptions.findOne({user:Meteor.userId(),request:this._id}).newMsg;
}
});

Template.allMessages.helpers({
  'room':function(){
    return Session.get("currentRoom").roomName;
  },
  'project':function(){
    return Projects.findOne({_id:Session.get("currentproject")});
  },
  timestampFixed: function() {
    return moment(this.timestamp).format('h:mm a');
  },  messages: function() {
      return ChatRooms.findOne({_id:Session.get("roomid")}).messages;
},
'color':function(){
  var x = Meteor.users.findOne({_id:this.user._id}).status.online;
return x;
},
'imgURL':function(){
  var x = Meteor.users.findOne({_id:this.user._id}).profile.avatar;
  return x;
}
});


Template.chat_template.events({
  'click #room': function(event) {
    Session.set('currentRoom', this);
    var room = ChatRooms.findOne(this._id);
    Session.set("roomid", this._id);
    Meteor.call('resetNotInRoom',this._id);
  },

  'click #vote':function(event,template){
    event.preventDefault();
    var req = Session.get("currentRoom");
    var vote =  template.find('#voteInput').value;
    var user = Meteor.userId();
    if(vote<=100 && vote>=0){
    Meteor.call('updateTotalScore',req,vote,user,Session.get('currentproject'),function(er){
  if(er){
        alert(er);
  }else{
          alert("Thank you for voting!");
          Meteor.call('updateNotificationAboutVote',req._id,user,vote);
          Meteor.call('updateCompleted',req,Session.get('currentproject'),function(er){
            if(er){
              alert(er);
            }
          })
  }
  })
}else{
  alert("Pleae enter a number in range 0-100");
}

  }
});

Template.chatForm.helpers({
  'reqScore':function(){
    return ChatRooms.findOne({_id:Session.get("roomid")}).reqScore;
  },
  'votes':function(){
    return ChatRooms.findOne({_id:Session.get("roomid")}).votes;

  },
  'comp':function(){
    return ChatRooms.findOne({_id:Session.get("roomid")}).completed;
  }
});
Template.chatForm.events({
  'submit #sendmsgFrm':function(event){
    event.preventDefault();
    if (Meteor.user()) {
      var name = Meteor.user().username;
      var message = event.target.text.value;
      if (message !== "") {
                var de = ChatRooms.update({_id: Session.get("roomid")}, {
                  $push: {
                    messages: {
                      message: message,
                      user: Meteor.user(),
                      timestamp: new Date()
                    }
                  }
                });
                event.target.text.value = "";
                Meteor.call("updateMsgNumberInConversation",Session.get("roomid"));
                Meteor.call("updateNotificationAboutMsg",Session.get("roomid"));
                Meteor.call("updateActiveInChatroom",Session.get("roomid"),Meteor.userId());
      }
  }else{
    alert("You must log in");
  }
}
});
