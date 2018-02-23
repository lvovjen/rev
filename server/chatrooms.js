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
       Meteor.call('addUserToConversationByReq',projId,newReq);
       }
   }
,

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

//update notification about msg
updateFeed:function(reqId,projId,val,type){
    var users = ChatRooms.findOne({_id:reqId}).userIds;
    var req = ChatRooms.findOne({_id:reqId});
    var proj = Projects.findOne({_id:projId});
    if(type=="msg"){
      _.forEach(users,function(u){
        //  Meteor.users.update({ _id:u.user},{$push:{notif:{projId:projId,info:[{reqN:req.roomName}]}}});
           Meteor.users.update({ _id:u.user,"notif.projId":projId},{$push:{reqN:req.roomName}});
      })
  }else{
    _.forEach(users,function(u){
      Meteor.users.update({ _id:u.user,"notif.projId":projId},{$push:{notif:[{info:{reqId:reqId,reqN:req.roomName,projN:proj.projectname,val:val,time: new Date(),type:"vote" }}]}});
  })
}
},//reqId:reqId, reqN:req.roomName, projId:projId, projN:proj.projectname, msg:msg, time:new Date()

updateCompleted:function(req,prodId){
  var r = ChatRooms.findOne({_id:req._id});
  var v = r.votes.length;
  var u = r.userIds.length-1;
if(r.TotalScore>=r.reqScore && v==u)
    {
      ChatRooms.update({_id:req._id},{$set:{completed: true}}) ;
      Projects.update({"requests._id":req._id},{$set:{"requests.$.completed": true}});
      Meteor.call('updateScore',req.creator._id,req);
    }else{
      ChatRooms.update({_id:req._id},{$set:{completed: false}}) ;
      Projects.update({"requests._id":req._id},{$set:{"requests.$.completed": false}});
      Meteor.call('updateScore',req.creator._id,req);
    }
}
,
updateMsgNumberInConversation: function(roomId){
      var temp = ChatRooms.findOne({_id: roomId}).messages.length;
      var de = ChatRooms.update({ _id: roomId},{$set:{ msgs: temp} });
  },
//Add the user to all the covnersations in project //Working
addUserToConversationByUser:function(projectId,userId){
    //Adding the permission to all project related requests
    var req = Projects.findOne({_id: projectId}).reqIds;
      if(req)  {
        req.forEach(function(item) {
          //check if user already in conversation.
          var u = ChatRooms.find({_id: item,userIds: {$in: [userId]}}).fetch();
          if (1 > u.length) {
            var newUserInConv = ChatRooms.update({_id: item}, {$push: {userIds: userId}});
          } else {
            console.log("Alrready in conversation");
          }
        });
      }
   },
//Add all the related usrs to project projectId to the conversation reqId //Working
addUserToConversationByReq:function(projectId,reqId){
       //Adding the permission to all project related requests
       console.log("addUserToConversationByReq");

       var users = Projects.findOne({_id: projectId}).userIds;
           users.forEach(function(item) {
             //check if user already in conversation.
             var u = ChatRooms.find({_id: reqId, userIds: {$in: [item]}}).fetch();
             if (1 > u.length) {
               var newUserInConv = ChatRooms.update({_id: reqId}, {$push: {userIds: item}});
             } else {
               console.log("Alrready in conversation");
             }
           });
      },


//Add specific user to specific conversation TODO
addUserToConversationByUserAndReq:function(userId,reqId){

},
//Remove the user from specific conversation TODO
removeUserFromConversation:function(userId,reqId){

},
isUserAllowed:function(userId,roomId){
  console.log(userId ,roomId);

  var u = ChatRooms.find({_id: roomId, userIds: {$in: [userId]}}).fetch();
  console.log(u.length);

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
