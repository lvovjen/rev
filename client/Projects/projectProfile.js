
Template.projectInfo.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chatrooms');
    this.subscribe('projects');
    this.subscribe('allUsers');

      });
});

Template.projectInfo.onRendered(function() {
});


Template.projectInfo.helpers({
  'req': function() {
    return Projects.findOne({_id:Session.get("currentproject")}).requests;
  },
  'votes':function(){
    return ChatRooms.findOne({_id:this._id}).votes;
  },
  'project': function() {
    return Projects.findOne({_id:Session.get("currentproject")});
  },
  'projectUsers': function() {
    return Projects.findOne({_id:Session.get("currentproject")}).userIds;
  },
  'reqFun': function() {
    return ChatRooms.find({project:Session.get("currentproject"),isFunc:true},{sort:{completed:1}});
  },
  'reqNonFun': function() {
    return ChatRooms.find({project:Session.get("currentproject"),isFunc:false},{sort:{completed:1}});
  },
  'creator':function(){
    return ChatRooms.find({project:Session.get("currentproject")});
  },
  'role':function(){
  },
  'imgURL':function(){
    var x = Meteor.users.findOne({_id:this.user}).profile.avatar;
    return x;
  },
  'bdg':function(){
    return Meteor.users.findOne({_id:this.user}).badges;
  },
  'level':function(){
    return Meteor.users.findOne({_id:this.user}).profile.level;
  },
  'fname':function(){
    return Meteor.users.findOne({_id:this.user}).profile.fisrtName;
  },
  'lname':function(){
    return Meteor.users.findOne({_id:this.user}).profile.lastName;
  },
  'score':function(){
    return Meteor.users.findOne({_id:this.user}).profile.score;
  },
  'badges':function(){
    Session.set('badges',Projects.findOne({_id:Session.get("currentproject")}).badgesEl);

    return Projects.findOne({_id:Session.get("currentproject")}).badgesEl;
  },
  'levels':function(){
    Session.set('levels',Projects.findOne({_id:Session.get("currentproject")}).levelsEl);
    Session.set('ldrbrd',Projects.findOne({_id:Session.get("currentproject")}).leaderBrdEl);
    return Projects.findOne({_id:Session.get("currentproject")}).levelsEl;
  },
  'c1':function(){
        if(Meteor.users.find({_id:this.user,"badges.bType":"badge1"}).fetch().length == 0){
        return false;
      }
  return true;
  },
  'c2':function(){
        if(Meteor.users.find({_id:this.user,"badges.bType":"badge2"}).fetch().length == 0){
        return false;
      }
    return true;
  },
  'c3':function(){
        if(Meteor.users.find({_id:this.user,"badges.bType":"badge3"}).fetch().length == 0){
        return false;
      }
  return true;
  },
  'c4':function(){
        if(Meteor.users.find({_id:this.user,"badges.bType":"badge4"}).fetch().length == 0){
        return false;
      }
  return true;
},
'compR':function(){
  return this.completed;
}

});

Template.projectProfile.helpers({
  'req': function() {
    return Projects.findOne({_id:Session.get("currentproject")}).requests;
  },
  'compR':function(){
    return this.completed;
  },
  'newmsgs':function(){
    return Subscriptions.findOne({user:Meteor.userId(),request:this._id}).newMsg;
  }
})

if (Meteor.isClient) {
    Template.projectImageItem.events = {
        'click #open-modal' : function() {
        event.preventDefault();
        $("#addProjectModal").modal("show");

        }
    };
    Template.projectEditUserButton.events = {
        'click .open-modal1' : function() {
        event.preventDefault();
        $("#projectEditUserModal").modal("show");
      }
    };
    Template.addProjectReqBtn.events = {
        'click .addProjectReqBtn' : function() {
        event.preventDefault();
        $("#addProjectReqModal").modal("show");
      }
    };
    Template.editProjectBtn.events = {
        'click .editProjectBtn' : function() {
        event.preventDefault();
        $("#editProjectModal").modal("show");
      }
    };
    Template.editReqModalBtn.events = {
        'click #open-editReqModal' : function() {
        event.preventDefault();
        $("#editReqModal").modal("show");
      }
    };
    Template.rmvReqBtn.events = {
        'click .open-rmvReqBtn' : function() {
        event.preventDefault();
        $("#removeReqModal").modal("show");
      }
    };
    Template.addProjectModal.events = {
      'click .addProjectBtn': function(event,template) {
        event.preventDefault();
        var projectname = template.find('#projectname').value;
        var descrpition = template.find('#projectDescrpition').value;
        var isLvlNewP = template.find('#isLvlNewP').checked;
        var isBdgsNewP = template.find('#isBdgsNewP').checked;
        var isLdrbNewP = template.find('#isLdrbNewP').checked;



if(projectname != "" && descrpition != ""){
      Meteor.call('createProject', projectname, descrpition,isLvlNewP,isBdgsNewP,isLdrbNewP,function(er){
          if(er){
          alert(er);
          }
          else{
            template.find('#projectname').value = "";
            template.find('#projectDescrpition').value = "";
            template.find('#isLvlNewP').checked = false;
            template.find('#isBdgsNewP').checked = false;
            template.find('#isLdrbNewP').checked = false;
            $("#addProjectModal").modal("hide");
            alert("Added successfully");
          }
      });
    }else{
      alert("You should fill all the fields");

    }
}
}
};

Template.chat_template.events({
  'click #room': function(event) {
    Session.set('currentRoom', this);
    var room = ChatRooms.findOne(this._id);
    Session.set("roomid", this._id);
    Meteor.call('resetNotInRoom',this._id);
  }
});

Template.addProjectReqModal.events({
  'click #isFunc':function(event,template){
    if(template.find('#isFunc').checked){
      Session.set('isFunc',true);
      }else{
        Session.set('isFunc',false);
      }
    },
  'click #addCtgBtn':function(event,template){
    event.preventDefault();
    var x = template.find('#newCat').value;
    if(x ==""){
      alert("Oh no,the field is empty!");
    }else{
      Meteor.call('addNewCategory',Session.get("currentproject"),x,function(er){
          if(er){
          alert(er);
          }
          else{
            alert("Added successfully");
          }
        })
      }
}
});
Template.projectEditUserModal.onRendered(function(){
  Session.set('isFunc',false);
});

Template.projectEditUserModal.events({
  'submit #addUserToProjectFrm':function(event,template){
    event.preventDefault();
    var role = template.find('#roleSelect').value;
    var userId = template.find('#userSelect').value;
    if(role == "Select Role"){
      alert("Please select a role");
    }else{
      Meteor.call('updateUserInProject', Session.get('currentproject'), userId,role);
    }
},
//not working
  'submit #removeUserFromProjectFrm':function(event,template){
    event.preventDefault();
    var user = template.find('#userSelectremove').value;
    var project = Session.get("currentproject");
      if(user && project){
          Meteor.call('removeUserFromProject',project, user);
        }
  },
  'submit #updateRoleInProjectFrm':function(event,template){
    event.preventDefault();
    var usId = template.find('#userSelectremove').value;
    var proId = Projects.findOne({_id:Session.get("currentproject")})._id;
    var role = template.find('#upRoleSelect').value;
  //  var u = Meteor.Users.find({fisrtName: projectname,userIds: {$in: [user._id]}}).fetch();

    Meteor.call('updateUserRole',proId, usId,role);
  }

});
Template.projectProfile.events({
  'click #room': function(event) {
    Session.set('currentRoom', this);
    var room = ChatRooms.findOne(this._id);
    Session.set("roomid", this._id);
    Meteor.call('resetNotInRoom',this._id);
  }
});

Template.projectInfo.events({
  'click #modalBtn': function(event) {
      Meteor.call('updateScore',Meteor.userId());
  }
});

  Template.projectEditUserModal.helpers({
    'user': function() {
      return Meteor.users.find({"projects.project._id":{$nin:[Session.get("currentproject")]}},{sort:{"profile.fisrtName":1}}).fetch();

    },
    'userSelectToRemove':function(){
      return Meteor.users.find({"projects.project._id":{$in:[Session.get("currentproject")]}}).fetch();
    }
});

Template.addProjectReqModal.helpers({
  'isFunc':function(){
    return Session.get('isFunc',Session.get('isFunc'));
  },
  'category':function(){
    return Projects.findOne({_id:Session.get("currentproject")}).categories;
  }
});

Template.statusRow.helpers({
  'width':function(){
      return ChatRooms.findOne({_id:this._id}).TotalScore;
},
'color':function(){
  var x = ChatRooms.findOne({_id:this._id}).TotalScore
  if (x<=40)
    return '#ff2e2e';
    if (x<=70 && x>=40)
      return '#ffbc0b';
      if (x<=100 && x>=70)
        return '#4da93c';
},
'completed':function(){
  return ChatRooms.findOne({_id:this._id}).completed;
}
})
