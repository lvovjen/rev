Meteor.methods({
  toggleAdmin(id){
    if(Roles.userIsInRole(id,'admin')){
      Roles.removeUsersFromRoles(id,'admin');
    }else
    {
      Roles.addUsersToRoles(id,'admin');
    }
  },
  saveGen:function(x,score){
    General.update({_id:x},{$set:{score:score}})
    if(x=="nonfunScore" || x=="funScore"){
      Meteor.call('scoreRecalc');
    }
  },
  getLshpbrd:function(){
    return General.findOne({_id:"leaderBrd"}).score;
  },
  setVar:function(x){
    if (Meteor.user()) {
    General.update({_id:"leaderBrd"},{$set:{score:x}});
  }else{
    throw new Meteor.Error('Oops, something went wrong', "error:'Oops, something went wrong");
  }
},
getLevels:function(){
  return General.findOne({_id:"levels"}).score;
},
//update bagde for user - userId = creator of the completed requirement
badgeForCompletion_Check:function(userId){
  if(Meteor.users.findOne({_id:userId})){
    var x = Meteor.users.findOne({_id:userId}).comReqs;

    if(x.length > 5){
      if(!(Meteor.users.findOne({_id:userId,"badges.bType":"badge1"})))
        {
                Meteor.users.update({_id:userId},{$push:{badges:{bType:"badge1",timestamp:new Date()}}});
        }
    }
  }else{
    console.log("The creator of the requirement is not active anymore");
  }
},
bagdeForCreatedRequirements_Check:function(userId){
  var x = ChatRooms.find({"creator._id":userId}).fetch();
if( x.length > 10)
  {
    if(Meteor.users.find({_id:userId,"badges.bType":"badge2"}).fetch().length == 0){
      Meteor.users.update({_id:userId},{$push:{badges:{bType:"badge2",timestamp:new Date()}}});
    }
}
},
badgeForParticipants_Check:function(userId){
  var x = Subscriptions.find({user:userId,active:true}).fetch();
    if( x.length > 5){
      if(Meteor.users.find({_id:userId,"badges.bType":"badge3"}).fetch().length == 0){
        Meteor.users.update({_id:userId},{$push:{badges:{bType:"badge3",timestamp:new Date()}}});
      }
    }

},
badgeForHighScoreCompletion_Check:function(userId){

},
updateActiveInChatroom:function(reqId,userId){
  if(!Subscriptions.findOne({request:reqId,user:userId}).active){
    Subscriptions.update({request: reqId,user:userId},{$set:{active:true}})
    var x = Subscriptions.find({user:userId,active:true}).fetch();
      if( x.length > 5){
          Meteor.call('badgeForParticipants_Check',userId);
      }
  }
}
/*
updateNotificationAboutBadge(userId,badge){
  if(Meteor.user()){
    vuser=Meteor.users.findOne({_id:userId});

    var users = Subscriptions.find({request: reqId}).fetch();
    users.forEach(function(u) {
      if(!(u.user == Meteor.userId()))
            {
              Subscriptions.update({request: reqId,user:u.user},{$push:{newNot:{type:"vote",ufName:vuser.profile.fisrtName, ulName:vuser.profile.lastName,vote:vote,rName:vreq.roomName,pName:vpro.projectname,timestamp:new Date()}}})
            }
          })
  }
}*/

 /* ,
addNewCategory:function(x){
  if (Meteor.user()) {
    var y=General.find({_id:"categories","score":{$in:[x]}}).fetch();
        if(y.length == 0){
          General.update({_id:"categories"},{$push:{score:x}});
        }else{
          throw new Meteor.Error('Maybe this category already exists', "Oops, something went wrong");
        }
      }else{
        throw new Meteor.Error('Oops, something went wrong', "You need to sign in");
      }
}*/
})
