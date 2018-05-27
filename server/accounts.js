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
    if (user.username.length >= 3 &&
     user.username.length <= 16 &&
     user.username !== 'root' &&
     user.username !== 'admin') {
      return true;
    } else {
      throw new Meteor.Error(403, 'Invalid username. Sorry!');
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(user.email.match(mailformat)){
      return true;
    } else {
      throw new Meteor.Error(403, 'Wring Email format');
    }}
);



Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return '<a href="' + url + '">Verify eMail</a> <br> \n\n Revise Team.';
};

Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `Welcome to Revise`;
};

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return 'You have been selected to participate in building a better future!'
    + ' To activate your account, simply click the link below:\n\n'
    + url+'\n\nRevise Team';
};

Accounts.emailTemplates.siteName = 'Revise';
Accounts.emailTemplates.from = 'Revise WebApp Admin <no-reply@example.com>';

Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'Revise Password Reset <no-reply@example.com>';
};

Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Activate your account now!";
   },
   text(user, url) {
      return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
   }
};

  Meteor.methods({
   createUsers: function(username, email,firstName,lastName,isAdmin,passkey){
    var userId = Accounts.createUser({username: username,profile:{firstName:firstName,lastName:lastName,email:email,isAdmin:isAdmin}, password: passkey});

//    console.log( Accounts.createUser({username: username, email: email,profile:{firstName:firstName,lastName:lastName,isAdmin:isAdmin}, password: 'initialPassword'}))
  //  Accounts.sendVerificationEmail(userId);
    if (isAdmin) {
      Roles.addUsersToRoles(userId,['admin'])
    } else {
      Roles.addUsersToRoles(userId, ['normal-user']);
  }
},
updateUsrProfile: function(userId,firstName,lastName,username,isAdmin){
  if(isAdmin){
    if(!Roles.userIsInRole(userId,'admin'))
    {
    Roles.addUsersToRoles(userId,['admin'])
  }
  }else{
    if(Roles.userIsInRole(userId,'admin')){
    Roles.removeUsersFromRoles(userId,['admin'])
  }
}
      Meteor.users.update({_id:userId},{$set:{"profile.fisrtName":firstName,"profile.lastName":lastName,username:username}});
},

//recalculation of the score after changing the score for functional or non functional requirement

//no need for this function because the score is just keep running with new values


scoreRecalc:function(){
  var x = Meteor.users.find({},{_id:1}).fetch();
  _.forEach(x,function(a){
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
      nf = General.findOne({_id:'nonfunScore'}).score;
      f = General.findOne({_id:'funScore'}).score;
      s = nf * result[0].nonFunc_count + f * result[0].func_count;
      Meteor.users.update({_id:a._id},{$set:{"profile.score":s}});

      Meteor.call('levels_check',a._id);

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
            }else{
              x=General.findOne({_id:'funScore'}).score;
              s=s+parseInt(x);
              Meteor.users.update({_id:userId},{$set:{"profile.score":s}});
              Meteor.call('levels_check',userId);

              //add to completed requests of the user
              Meteor.users.update({_id:userId},{$push:{comReqs:{_id:req._id,isFunc:req.isFunc}}});
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
resetScore:function(userId){
  Meteor.users.update({_id:userId},{$set:{"profile.score":0}});
  Meteor.users.update({_id:userId},{$set:{"comReqs":[]}});
  Meteor.users.update({_id:userId},{$set:{'profile.level':"Kilo - User"}});


},
resetAllScore:function()
{
  var users = Meteor.users.find({}).fetch();
  _.forEach(users,function(u){
      Meteor.call('resetScore',u._id);
    })
},
  updateActiveUsr:function(userId){
    if(Meteor.users.findOne({_id:userId}).active){
          Meteor.users.update({_id:userId},{$set:{active:false}});
        }else{
          Meteor.users.update({_id:userId},{$set:{active:true}});
        }
  },
  levels_check:function(userId){
        if(Meteor.users.findOne({_id:userId}))
          {
            var x = Meteor.users.findOne({_id:userId}).profile.score;
            var l = Meteor.users.findOne({_id:userId}).profile;

            var a = General.findOne({_id:"megauser"}).score;
            var b = General.findOne({_id:"gigauser"}).score;
            var c = General.findOne({_id:"terauser"}).score;
            var reqs = ChatRooms.find({"userIds.user":userId}).fetch();
            if(x < a){
              Meteor.users.update({_id:userId},{$set:{'profile.level':"Kilo - User"}});
              if(l.level !== "Kilo - User"){
                _.forEach(reqs,function(u){
                  ChatRooms.update({_id:u._id},{$push:{messages:{message:"Congratulations! "+ l.lastName +" "+ l.fisrtName +" is a Kilo - User now!",user:{profile:{fisrtName:"Revise",lastName:"Admin",avatar:"avatarLogo.gif"}},timestamp: new Date()}}})
                })
              }
            }
            if(x >= a && x < b){
              Meteor.users.update({_id:userId},{$set:{'profile.level':"Mega - User"}});
              if(l.level !== "Mega - User"){
                _.forEach(reqs,function(u){
                    ChatRooms.update({_id:u._id},{$push:{messages:{message:"Congratulations! "+ l.lastName +" "+ l.fisrtName +" is a Mega - User now!",user:{profile:{fisrtName:"Revise",lastName:"Admin",avatar:"avatarLogo.gif"}},timestamp: new Date()}}})
                })
            }
          }
            if(x >= b && x < c){
              Meteor.users.update({_id:userId},{$set:{'profile.level':"Giga - User"}});
              if(l.level !== "Giga - User"){
                _.forEach(reqs,function(u){
                  ChatRooms.update({_id:u._id},{$push:{messages:{message:"Congratulations! "+ l.lastName +" "+ l.fisrtName +" is a Giga - User now!",user:{profile:{fisrtName:"Revise",lastName:"Admin",avatar:"avatarLogo.gif"}},timestamp: new Date()}}})
                })
            }
          }
            if(x >= c){
              Meteor.users.update({_id:userId},{$set:{'profile.level':"Tera - User"}});
              if(l.level !== "Tera - User"){
                _.forEach(reqs,function(u){
                  ChatRooms.update({_id:u._id},{$push:{messages:{message:"Congratulations! "+ l.lastName +" "+ l.fisrtName +" is a Tera - User now!",user:{profile:{fisrtName:"Revise",lastName:"Admin",avatar:"avatarLogo.gif"}},timestamp: new Date()}}})
                })
            }
          }
    }
  },

  levels_checkAll:function(userId){
      var users = Meteor.users.find({}).fetch();
      _.forEach(users,function(u){
        Meteor.call('levels_check',u._id);
      })
    },

  removeUser:function(userId){
    if(Meteor.users.remove({_id:userId})){
    //remove from projects
    var projs = Projects.find({"userIds.user":{$in:[userId]}}).fetch();

    _.forEach(projs,function(a){
      Projects.update({_id:a._id},{$pull:{userIds:{user:userId}}});
    });
    //remove frome chatrooms

      var reqs = ChatRooms.find( { "userIds.user": { $in: [userId] } } ).fetch();
    _.forEach(reqs,function(a){
      Meteor.call('removeUserFromConversation',userId,a._id);
    });
    }
  }
});



Accounts.onCreateUser(function(options, user) {
  user.profile = {
    fisrtName: options.profile.firstName,
    lastName: options.profile.lastName,
    score: 0,
    level: "Kilo - User",
    date_created: new Date(),
    comReqs:[],
    avatar:"avatarLogo.gif"
  },
  user.pass = options.profile.pass
/*
  user.levelsEl = true,
  user.badgesEl = true,
  user.leaderBrdEl = true*/
    return user;
});
