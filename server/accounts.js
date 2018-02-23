import {
  Meteor
} from 'meteor/meteor';

Meteor.publish('users', function() {
  return Meteor.users.find();
});

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
  updateScore:function(userId,req){
  //  var rf=ChatRooms.find({"creator._id":userId,isFunc:true,completed:true}).count();
  //  var rnf=ChatRooms.find({"creator._id":userId,isFunc:false,completed:false}).count();
    //var s = (General.findOne({_id:"funScore"}).score)*rf+(General.findOne({_id:"nonfunScore"}).score)*rnf;
    console.log(userId,req);

    var s = Meteor.users.findOne({_id:userId}).profile.score;
    console.log(s);
  //  ChatRooms.update({_id:a._id},{scoredFor:{$push:{s}}});
  if(req.isFunc == true)
{
  console.log(Meteor.users.find({fComp:{$in:[req._id]}}).length>0);
      if(Meteor.users.find({fComp:{$in:[req._id]}}).length>0)
      {
        Meteor.users.findOne({_id:userId},{$push:{fComp:req._id}});
      }
}else{
  Meteor.users.findOne({_id:userId},{$push:{nfComp:req._id}});
}

//  Meteor.users.update({_id:userId},{$set:{"profile.score":s}});

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
    notif:[]
  }
  return user;
});
