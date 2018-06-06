Meteor.methods({
  createProject: function(projectname, descrpition,isLvlNewP,isBdgsNewP,isLdrbNewP) {
    if (Meteor.user()) {
      var user = Meteor.users.findOne({_id:Meteor.userId()});
      var res = Projects.findOne({projectname: projectname});
      if (res) {
        //already room exists
        console.log("exists");
      } else {
        //no room exists
      if(Projects.insert({
          createdAt: new Date(),
          projectname: projectname,
          reqNum: 0,
          descrpition: descrpition,
          creator: {_id:Meteor.userId(),profile:Meteor.user().profile},
          levelsEl:isLvlNewP,
          badgesEl:isBdgsNewP,
          leaderBrdEl:isLdrbNewP,
          requests: [],
          userIds: [],
          categories:[],
          active:true,

                })
              ){
                Meteor.call('updateUserInProject',Projects.findOne({projectname: projectname})._id,user._id,'Creator')
            return 1;
          }
        else{
          throw new Meteor.Error('Project not added', "error:Project not added");
        }
      }
    }
  },

  updateUserInProject: function(projectId,userId,role) {
    if (Meteor.user()) {
        var pro = Projects.findOne({_id:projectId});
        var user=  Meteor.users.findOne({_id:userId});
  //if user is in the project already
        var u = Projects.find({_id:projectId,"userIds.user":{$in: [userId]}}).fetch();

        if (pro && user) {
          if (0 == u.length) {
            //Add user to project
            if(Projects.update({_id: pro._id}, {$push: {userIds: {user:user._id,profile:user.profile,role:role}}})){
              //update role in user profile
                    Meteor.users.update({_id: userId},{$push:{projects: {role:role, project:{_id:pro._id,projectname:pro.projectname,descrpition:pro.descrpition}}}});
					              Meteor.users.update({_id:userId},{$push:{notif:{type:"proj",pName:pro.projectname,timestamp:new Date()}}})
s
                      Meteor.call('addUserToConversationByUser',projectId,userId,role);
          } else {
            console.log("Already in room");
          }
        }
    }
  }
},
//not working
removeUserFromProject: function(proId, userId) {
  if (Meteor.user()) {
    var pro = Projects.findOne({_id: proId});
    var user=  Meteor.users.findOne({_id: userId});
//if user is in the project
    var u = Projects.find({_id: proId,userIds: {$in: [userId]}}).fetch();
    if (pro && user) {
      if (1 > u.length) {
        Projects.update({_id: pro._id}, {$pull: {userIds: {user:userId}}});
        Meteor.users.update({_id:userId},{$pull:{projects:{"project._id":proId}}});

        pro.requests.forEach(function(item) {
        //remove user from all related request
        console.log("in requsets items");
        Meteor.call('removeUserFromConversation',userId,item._id );
      });
      } else {
        console.log("Already in room");
      }
    }
  //  Meteor.call('addUserToConversationByUser',pro._id,user);
}},
updateUserRole: function(proId, userId,role) {
  if (Meteor.user()) {
    var pro = Projects.findOne({_id: proId});
    var u = Projects.find({_id: proId,userIds: {$in: [userId]}}).fetch();
//update role in user profile
    if(pro && u){

      Meteor.users.update({_id: userId,"projects.project._id":proId},{$set:{role:role}});

    }

  //  var user=  Meteor.users.findOne({username: user});
//if user is in the project already
/*    if (pro && user) {
      if (1 > u.length) {
        //Add user to project
        var newUserInProject = Projects.update({_id: pro._id}, {$push: {userIds: {user:user._id,profile:user.profile,role:role}}});
      } else {
        console.log("Already in room");
      }
    }*/
  }
},
  addConversationToProject:function(projectId,reqId){
  if (Meteor.user()) {
        var pro = Projects.findOne({_id: projectId});
        var room = ChatRooms.findOne({_id: reqId});
        if(pro && room)
          {
              Projects.update({_id: projectId}, {$push: {requests: room}});
              var temp = Projects.findOne({_id: projectId}).requests.length;
              Projects.update({_id: projectId}, {$set:{reqNum: temp}});
          }
    }
},
//Working
removeConversationFromProject:function(projectId,reqId){
if (Meteor.user()) {
      var pro = Projects.findOne({_id: projectId});
      var room = ChatRooms.findOne({_id: reqId});
      if(pro && room)
        {
            var newRequestInProject = Projects.update({_id: projectId}, {$pull: {requests:{_id: reqId}}});
            var temp = Projects.findOne({_id: projectId}).requests.length;
            var newRequestInProject = Projects.update({_id: projectId}, {$set:{reqNum: temp}});
        }else{
          throw new Meteor.Error('Oops, something went wrong', "error:'Oops, something went wrong");
        }
  }
},
addNewCategory:function(proId,x){
  if (Meteor.user()) {
    var y=Projects.find({_id:proId, "categories":{$in:[x]}}).fetch();

        if(y.length == 0){
          Projects.update({_id:proId},{$push:{categories:x}});
        }else{
          throw new Meteor.Error('Maybe this category already exists', "Oops, something went wrong");
        }
      }else{
        throw new Meteor.Error('Oops, something went wrong', "You need to sign in");
      }
},
//val Boolean
changeleaderBrdEl:function(proId,val){
  if(Projects.findOne({_id:proId})){
    Projects.update({_id:proId},{$set:{leaderBrdEl:val}});
  }
},
//val Boolean
changebadgesEl:function(proId,val){
  if(Projects.findOne({_id:proId})){
      Projects.update({_id:proId},{$set:{badgesEl:val}});
  }
},
//val Boolean
changelevelsEl:function(proId,val){
  if(Projects.findOne({_id:proId})){
      Projects.update({_id:proId},{$set:{levelsEl:val}});
  }
},
diactivateProject:function(projId){
    if(Projects.findOne({_id:projId})){
      if(Projects.findOne({_id:projId}).active){
      Projects.update({_id:projId},{$set:{active:false}});
    }else{
      Projects.update({_id:projId},{$set:{active:true}});

    }
  }
}
});
