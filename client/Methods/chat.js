Template.allMessages.onCreated(function() {
  this.autorun(() => {
    this.subscribe('allUsers');
      });
});

Template.allMessages.onRendered(function(){
  var objDiv = document.getElementById("panel panel-default chat");
    objDiv.scrollTop = objDiv.scrollHeight;
})


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
    return moment(this.timestamp).format('h:mma DD/MM/YYYY');
  },
  messages: function() {
  var ms = ChatRooms.findOne({_id:Session.get("roomid")}).messages;
      return _.sortBy(ms, e => e.timestamp).reverse();
  },
  'color':function(){
    var x = Meteor.users.findOne({_id:this.user._id}).status.online;
  return x;
  },
  'imgURL':function(){
    var x = Meteor.users.findOne({_id:this.user._id}).profile.avatar;
    return x;
  },
   'c1':function(){
          if(Meteor.users.find({_id:this.user._id,"badges.bType":"badge1"}).fetch().length == 0){
          return false;
        }
    return true;
    },
    'c2':function(){
          if(Meteor.users.find({_id:this.user._id,"badges.bType":"badge2"}).fetch().length == 0){
          return false;
        }
      return true;
    },
    'c3':function(){
          if(Meteor.users.find({_id:this.user._id,"badges.bType":"badge3"}).fetch().length == 0){
          return false;
        }
    return true;
    },
    'c4':function(){
          if(Meteor.users.find({_id:this.user._id,"badges.bType":"badge4"}).fetch().length == 0){
          return false;
        }
    return true;
  },
  'badges':function(){
    return Session.get('badges');
  },
  'compR':function(){
    return ChatRooms.findOne({_id:Session.get('roomid')}).completed;
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
          Meteor.call('updateNotificationAboutVote',req._id,user,vote,function(er){
            if(er){
              alert(er);
            }
          })
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
  },
    'reqDesc':function(){
      return ChatRooms.findOne({_id:Session.get('roomid')}).descrpition;
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
},
'click #saveDescChangesChat':function(event,template){
  event.preventDefault();
   var desc = template.find('#editReqDescrpitionInChat').value;
   Meteor.call('updateDescription',Session.get('roomid'),desc);
  }
});
/*
setTimeout(function() {
   var objDiv = document.getElementById("panel panel-default chat");
   console.log(objDiv.scrollHeight);
   console.log(objDiv.scrollTop);
   objDiv.scrollTop = objDiv.scrollHeight;

   console.log(objDiv.scrollTop);
}, 100);
*/
