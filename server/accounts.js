import {
  Meteor
} from 'meteor/meteor';


/*
By default, the current user’s username, emails and profile are published
to the client. You can publish additional fields for the current user with:

Meteor.publish('userData', function () {
if (this.userId) {
  return Meteor.users.find({ _id: this.userId }, {
    fields: { other: 1, things: 1 }
  });
} else {
  this.ready();
}
});
*/

// Validate username, without a specific error message.
  Accounts.validateNewUser((user) => {
    if (user.username && user.username.length >= 3) {
      return true;
    } else {
      throw new Meteor.Error(403, 'Username must have at least 3 characters');
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(user.email.match(mailformat)){
      return true;
    } else {
      throw new Meteor.Error(403, 'Email format wrong');
    }}
);

  Meteor.methods({
   createUsers: function(username, email,firstName,lastName,isAdmin){
    var userId = Accounts.createUser({username: username, email: email,
      profile:{firstName:firstName,lastName:lastName,isAdmin:isAdmin}, password: 'initialPassword'});
    Accounts.sendEnrollmentEmail(userId);
    console.log(isAdmin)
    if (isAdmin == 'true') {
      Roles.addUsersToRoles(userId,['admin'])
    } else {
      Roles.addUsersToRoles(userId, ['normal-user']);
  }
},
updateUsrProfile: function(userId,firstName,lastName,username){
  Meteor.users.update({_id:userId},{$set:{"profile.fisrtName":firstName,"profile.lastName":lastName,username:username}});
},

//recalculation of the score after changing the score for functional or non functional requirement
scoreRecalc:function(){
  var x = Meteor.users.find({},{_id:1}).fetch();
  _.forEach(x,function(a){
    console.log(a._id);
    var result = Meteor.users.aggregate([
        { "$unwind": "$comReqs" },
          {
            "$match": { "_id": a._id }
        },
          {  "$group": {
              "_id" : "$a._id",
                "func_count": {
                    "$sum": {
                        "$cond": [ { "$eq": [ "$comReqs.isFunc",true ] }, 1, 0 ]
                    }
                },
                "nonFunc_count": {
                    "$sum": {
                        "$cond": [ { "$eq": [ "$comReqs.isFunc",false] }, 1, 0 ]
                    }
                }
            }
          }
    ]);
    //  console.log(result[0].nonFunc_count);
    //  console.log(result[0].func_count);
      nf = General.findOne({_id:'nonfunScore'}).score;
      f = General.findOne({_id:'funScore'}).score;
      s = nf * result[0].nonFunc_count + f * result[0].func_count;
    //  console.log(s);
      Meteor.users.update({_id:a._id},{$set:{"profile.score":s}});

      var cr = ChatRooms.find({"creator._id":a._id}).fetch();
  //update in chatrooms where creator is the user
            _.forEach(cr,function(b){
                ChatRooms.update({_id:b._id},{$set:{"creator.profile.score":s}});
            });
      var cr = ChatRooms.find( { "userIds.user": { $in: [a._id] } } ).fetch();
              _.forEach(cr,function(b){
  //update in chatrooms where in usersId
                ChatRooms.update({_id:b._id,"userIds.user":a._id},{$set:{'userIds.$.profile.score':s}})
              });
      var cr = Projects.find({"userIds.user":{$in:[a._id]}}).fetch();
              _.forEach(cr,function(b){
  //update in chatrooms where in usersId
                Projects.update({_id:b._id,"userIds.user":a._id},{$set:{'userIds.$.profile.score':s}})
              });
  })
},

//updating the score after a completion of a requirement and adding the req id to an
//array that holds all the completed requirement that created by the user
  updateScore:function(userId,req){
    var s = parseInt(Meteor.users.findOne({_id:userId}).profile.score);
    var u = Meteor.users.find({_id: userId, "comReqs._id": {$in: [req._id]}}).fetch();

    if (1 > u.length) {
          if(req.isFunc == false)
            {
              x=General.findOne({_id:'nonfunScore'}).score;
              s=s+parseInt(x);
              Meteor.users.update({_id:userId},{$set:{"profile.score":s}});
              //add to completed requests of the user
              Meteor.users.update({_id:userId},{$push:{comReqs:{_id:req._id,isFunc:req.isFunc}}});
              console.log(s)
            }else{
              x=General.findOne({_id:'funScore'}).score;
              parseInt(x);
              s=s+parseInt(x);
              Meteor.users.update({_id:userId},{$set:{"profile.score":s}});
              //add to completed requests of the user
              Meteor.users.update({_id:userId},{$push:{comReqs:{_id:req._id,isFunc:req.isFunc}}});
              console.log(s)
}
      }else{
      }
    var cr = ChatRooms.find({"creator._id":userId}).fetch();
//update in chatrooms where creator is the user
          _.forEach(cr,function(a){
              ChatRooms.update({_id:a._id},{$set:{"creator.profile.score":s}});
          });
    var cr = ChatRooms.find( { "userIds.user": { $in: [userId] } } ).fetch();
            _.forEach(cr,function(a){
//update in chatrooms where in usersId
              ChatRooms.update({_id:a._id,"userIds.user":userId},{$set:{'userIds.$.profile.score':s}})
            });
    var cr = Projects.find({"userIds.user":{$in:[userId]}}).fetch();
            _.forEach(cr,function(a){
//update in chatrooms where in usersId
              Projects.update({_id:a._id,"userIds.user":userId},{$set:{'userIds.$.profile.score':s}})
            });
},
  updateBadge:function()
{

}});

Accounts.onCreateUser(function(options, user) {
  user.profile = {
    fisrtName: options.profile.firstName,
    lastName: options.profile.lastName,
  //  picture : "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
    score: 0,
    badges: [{type:"Kilo-User"}],
    date_created: new Date(),
    notif:[],
    comReqs:[]
  }
  return user;
});