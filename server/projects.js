Meteor.methods({
  createProject: function(projectname, descrpition) {
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
          requests: [],
          userIds: [],
          categories:['Accessibility','Backup','Documentation','Reliability' ,'Reusability']
                })
              ){
                Meteor.call('updateUserInProject',Projects.findOne({projectname: projectname})._id,user.username,'Creator')
            return 1;
          }
        else{
          throw new Meteor.Error('Project not added', "error:Project not added");
        }
      }
    }
  },

  updateUserInProject: function(projectId,user,role) {
    if (Meteor.user()) {

      var pro = Projects.findOne({_id:projectId});
      var user=  Meteor.users.findOne({username:user});
//if user is in the project already
      var u = Projects.find({_id:projectId,"userIds.user":{$in: [user._id]}}).fetch();

      if (pro && user) {
        if (0 == u.length) {
          //Add user to project
          if(Projects.update({_id: pro._id}, {$push: {userIds: {user:user._id,profile:user.profile,role:role}}})){
            //update role in user profile
                  Meteor.users.update({username: user},{$push:{projects: {role:role, project:{_id:pro._id,projectname:pro.projectname,descrpition:pro.descrpition}}}});
                  Meteor.call('addUserToConversationByUser',pro._id,user);

          }
        } else {
          console.log("Already in room");
        }
      }
  }
},
//not working
removeUserFromProject: function(projectname, user) {
  if (Meteor.user()) {
    var pro = Projects.findOne({projectname: projectname});
    var user=  Meteor.users.findOne({username: user});
//if user is in the project
    var u = Projects.find({projectname: projectname,userIds: {$in: [user._id]}}).fetch();
    if (pro && user) {
      if (1 > u.length) {
        //Add user to project

      console.log("good");
        Projects.update({_id: pro._id}, {$pull: {userIds: {user:user._id}}});
      } else {
        console.log("Already in room");
      }
    }
    Meteor.call('addUserToConversationByUser',pro._id,user);
}},
updateUserRole: function(projectname, user,role) {
  if (Meteor.user()) {
    var pro = Projects.findOne({projectname: projectname});
//update role in user profile
    Meteor.users.update({username: user,projects:{project:pro._id}},{$set:{role:role}});
    var user=  Meteor.users.findOne({username: user});
//if user is in the project already
    var u = Projects.find({projectname: projectname,userIds: {$in: [user._id]}}).fetch();
/*    if (pro && user) {
      if (1 > u.length) {
        //Add user to project
        var newUserInProject = Projects.update({_id: pro._id}, {$push: {userIds: {user:user._id,profile:user.profile,role:role}}});
      } else {
        console.log("Already in room");
      }
    }*/
    Meteor.call('addUserToConversationByUser',pro._id,user);
}
},
  addConversationToProject:function(projectId,reqId){
  if (Meteor.user()) {
        var pro = Projects.findOne({_id: projectId});
        var room = ChatRooms.findOne({_id: reqId});
        if(pro && room)
          {
              var newRequestInProject = Projects.update({_id: projectId}, {$push: {requests: room}});
              var temp = Projects.findOne({_id: projectId}).requests.length;
              var newRequestInProject = Projects.update({_id: projectId}, {$set:{reqNum: temp}});
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
}

});
