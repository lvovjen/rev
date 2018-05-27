Meteor.methods({
 createConversation: function(projId ,roomname, descrpition,isFunc,reqScore,cat,user){

   if (Meteor.user()) {
     /*var res = ChatRooms.findOne({roomName: roomname});
     if (res) {
       //already room exists
     } else {*/
           //no room exists
           var newReq = ChatRooms.insert({
             createdAt: new Date(),
             creator: {_id:Meteor.userId(),profile:Meteor.user().profile},
             roomName: roomname,
             descrpition:descrpition,
             reqScore:reqScore,
             cat:cat,
             completed: false,
             msgs:Number(0),
             isFunc:isFunc ,
             project:projId,
             TotalScore:Number(0),
             votes:[],
             userIds: [Meteor.userId()],
             messages: []
           });
       Meteor.call('addConversationToProject',projId,newReq);
       Meteor.call('addUserToConversationByReq',projId,newReq,"creator");
       Meteor.call('bagdeForCreatedRequirements_Check',Meteor.userId());
       }
   }
,
//Mean score for each request
updateTotalScore:function(req,vote,user,prodId){
  var user = Meteor.users.findOne({_id:user});
  var exists = ChatRooms.find({"votes.user":user._id,_id:req._id}).fetch();
if(exists.length > 0)
  {
      ChatRooms.update({_id:req._id},{$pull:{votes:{user:user._id}}});
        //ChatRooms.update({_id:req._id,votes:{user:user._id, profile:user.profile}},{$set:{votes:vote}});
      ChatRooms.update({_id:req._id},{$push:{votes:{user:user._id, profile:user.profile, vote:vote, timestamp:new Date()}}}) ;
}else{
  ChatRooms.update({_id:req._id},{$push:{votes:{user:user._id, profile:user.profile, vote:vote, timestamp:new Date()}}}) ;
}
  var r = ChatRooms.findOne({_id:req._id});
  var score = Number(0);
    _.forEach(r.votes,function(v){
        score = score + Number(v.vote);
    })
    score = Math.floor(score / (r.votes.length));
    ChatRooms.update({_id:req._id},{$set:{TotalScore:score}}) ;
    }
,

/*
//update notification about msg
updateFeed:function(reqId,projId,type){
    var users = ChatRooms.findOne({_id:reqId}).userIds;
    var req = ChatRooms.findOne({_id:reqId});
    var proj = Projects.findOne({_id:projId});
    if(type=="msg"){
      _.forEach(users,function(u){
        if(u.user != Meteor.userId()){
        //  Meteor.users.update({ _id:u.user},{$push:{notif:{projId:projId,info:[{reqN:req.roomName}]}}});
        Meteor.users.update({ _id:u.user},{$push:{notif:{reqId:reqId,reqN:req.roomName,projN:proj.projectname,type:"msg"}}});
          }
      })

  }else if(type=="vote"){
    _.forEach(users,function(u){
      if(u.user != Meteor.userId()){
      Meteor.users.update({ _id:u.user},{$push:{notif:{reqId:reqId,reqN:req.roomName,projN:proj.projectname,type:"vote"}}});
  }
})
}
},//reqId:reqId, reqN:req.roomName, projId:projId, projN:proj.projectname, msg:msg, time:new Date()
*/
updateCompleted:function(req,prodId){
  var r = ChatRooms.findOne({_id:req._id});
  var v = r.votes.length;
  var u = r.userIds.length-1;
  if(r.completed==false){
      if(r.TotalScore>=r.reqScore && v==u)
          {
            ChatRooms.update({_id:req._id},{$set:{completed: true}}) ;
            Projects.update({"requests._id":req._id},{$set:{"requests.$.completed": true}});
            Meteor.call('updateNotificationAboutCompletion',req._id);
            Meteor.call('updateScore',req.creator._id,req);
            Meteor.call('badgeForCompletion_Check', req.creator._id);
            Meteor.call('badgeForHighScoreCompletion_Check', req.creator._id);

          }else{
            ChatRooms.update({_id:req._id},{$set:{completed: false}}) ;
            Projects.update({"requests._id":req._id},{$set:{"requests.$.completed": false}});
        }
  }else{
    if(r.TotalScore>=r.reqScore && v==u)
        {
        }else{
          ChatRooms.update({_id:req._id},{$set:{completed: false}}) ;
          Projects.update({"requests._id":req._id},{$set:{"requests.$.completed": false}});
      }
  }
}
,
updateMsgNumberInConversation: function(roomId){
      var temp = ChatRooms.findOne({_id: roomId}).messages.length;
      var de = ChatRooms.update({ _id: roomId},{$set:{ msgs: temp} });
  },
  //update subscriptions, for each user in the room update the notification abouut new msg in the room
  updateNotificationAboutMsg(reqId){
    if(Meteor.user){
      var users = Subscriptions.find({request: reqId}).fetch();
      users.forEach(function(u) {
        if(!(u.user == Meteor.userId()))
              {
                 var x = Subscriptions.findOne({request: reqId,user:u.user}).newMsg + 1;
                        Subscriptions.update({request: reqId,user:u.user},{$set:{newMsg:x}})
              }
            })
    }
  },
resetNotInRoom(reqId){
    if(Meteor.user){
      var x=Subscriptions.find({request: reqId,user:Meteor.userId()}).fetch();

      if(x.length > 0){
        Subscriptions.update({request: reqId,user:Meteor.userId()},{$set:{newMsg:0}})
      }
    }
},
updateDescription(roomId,desc){
    if(Meteor.user){
      if(ChatRooms.findOne({_id:roomId})){
        ChatRooms.update({_id:roomId},{$set:{descrpition:desc}})
      }
    }
},
  updateNotificationAboutVote(reqId,userId,vote){
    if(Meteor.user()){
      vuser=Meteor.users.findOne({_id:userId});
      vreq=ChatRooms.findOne({_id:reqId});
      vpro=Projects.findOne({_id:vreq.project});

      var users = Subscriptions.find({request: reqId}).fetch();
      users.forEach(function(u) {
        if(!(u.user == Meteor.userId()))
              {
                Meteor.users.update({_id:u.user},{$push:{notif:{type:"vote",ufName:vuser.profile.fisrtName, ulName:vuser.profile.lastName,vote:vote,rName:vreq.roomName,pName:vpro.projectname,timestamp:new Date()}}})
              }
            })
    }
  },
  updateNotificationAboutCompletion(reqId){
    if(Meteor.user()){
      var users = Subscriptions.find({request: reqId}).fetch();
      vreq=ChatRooms.findOne({_id:reqId});
      users.forEach(function(u) {
                Meteor.users.update({_id:u.user},{$push:{notif:{type:"completion",rName:vreq.roomName,pName:vpro.projectname,timestamp:new Date(),rScore:vreq.TotalScore}}})
    })
  }
},

//Add the user to all the covnersations in project //Working
addUserToConversationByUser:function(projectId,userId,role){
    //Adding the permission to all project related requests
    var req = Projects.findOne({_id: projectId}).requests;
    var user = Meteor.users.findOne({_id:userId});
      if(req)  {
        req.forEach(function(item) {
          //check if user already in conversation.
          var u = ChatRooms.find({_id: item._id, "userIds.user": {$in: [userId]}}).fetch();
          if (0 == u.length) {
            if(ChatRooms.update({_id: item._id}, {$push:{userIds: {user: userId,profile:user.profile,role:role}}}))
              {
                Subscriptions.insert({user:userId,request:item._id,newNot:[],newMsg:0,active:false});
              }
          } else {
            console.log("Alrready in conversation");
          }
        });
      }
   },
//Add all the related usrs to project projectId to the conversation reqId //Working
addUserToConversationByReq:function(projectId,reqId,role){
       //Adding the permission to all project related requests
       var users = Projects.findOne({_id: projectId}).userIds;
            users.forEach(function(item) {
              //check if user already in conversation.
              var u = ChatRooms.find({_id: reqId, "userIds.user": {$in: [item.user]}}).fetch();
              if (0 == u.length) {
                if(ChatRooms.update({_id: reqId}, {$push: {userIds:{user: item.user,profile:item.profile,role:role}}})){
                Subscriptions.insert({user:item.user,request:reqId,newNot:[],newMsg:0,active:false});
 }
              } else {
                console.log("Alrready in conversation");
              }
            });
       },

//Add specific user to specific conversation TODO
addUserToConversationByUserAndReq:function(userId,reqId){

},
//Remove the user from specific conversation
removeUserFromConversation:function(userId,reqId){
  var req = ChatRooms.findOne({_id: reqId});
  var isIn = ChatRooms.find({_id: reqId,userIds: {$in: [userId]}}).fetch();
if(isIn)  {

    if(req)  {
        //check if user in conversation.
        var u = ChatRooms.find({_id: reqId,"userIds.user": {$in: [userId]}}).fetch();
        if (0 < u.length) {
          Subscriptions.remove({user:userId,request:reqId});
          ChatRooms.update({_id:reqId},{$pull:{userIds:{user:userId}}});
        } else {
        }
      };
    }
  },
isUserAllowed:function(userId,roomId){
  var u = ChatRooms.find({_id: roomId, userIds: {$in: [userId]}}).fetch();

  if(u.length>0){
      var allowed = true;
    }else{
      var allowed = false;
    }
    return allowed;

},
removeReq:function(reqId,projId){
var r = ChatRooms.find({_id:reqId}).fetch();
var p = Projects.find({_id:projId}).fetch();
      if (!r)
      {
          throw new Meteor.Error('No such requirement', "error:No such requirement");
      }
          Meteor.call('removeConversationFromProject',projId,reqId,r.descrpition,r.roomname,r.reqScore,r.cat,r.isFunc);
          ChatRooms.remove({_id:reqId});
          Subscriptions.remove({request:reqId});

},
editReq:function(projId,reqId,descrpition,reqname,score,cat,isF){
    var r = ChatRooms.find({_id:reqId}).fetch();
    var p = Projects.find({_id:projId}).fetch();
      if(r && p)
      {
        ChatRooms.update({_id:reqId},{$set:{descrpition:descrpition,roomName:reqname,reqScore:score,cat:cat,isFunc:isF}});
        Projects.update({"requests._id":reqId},{$set:{"requests.$.descrpition": descrpition,"requests.$.roomName":reqname,"requests.$.reqScore":score,"requests.$.cat":cat,"requests.$.isFunc":isF}});
      }
  }

});
