Template.sidebarBoot.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chatrooms');
    this.subscribe('projects');
      });

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
}
});


Template.chat_template.events({
  'click #room': function(event) {
    Session.set('currentRoom', this);
    var room = ChatRooms.findOne(this._id);
    Session.set("roomid", this._id);
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
  }})
  //  Meteor.call("updateFeed",Session.get("roomid"),Session.get("currentproject"),vote,"vote");
  Meteor.call("updateFeed",Session.get("roomid"),Session.get("currentproject"),"vote");

  Meteor.call('updateCompleted',req,Session.get('currentproject'),function(er){
    if(er){
      alert(er);
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
          Meteor.call("updateFeed",Session.get("roomid"),Session.get("currentproject"),message,"msg");
    }
  }else{
    alert("login");
  }
}
});
