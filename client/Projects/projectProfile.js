
Template.projectInfo.onCreated(function() {
  this.autorun(() => {
    this.subscribe('chatrooms');
    this.subscribe('projects');
      });
});



Template.projectInfo.helpers({
  'req': function() {
    return Projects.findOne({_id:Session.get("currentproject")}).requests;
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
if(projectname != "" && descrpition != ""){
      Meteor.call('createProject', projectname, descrpition,function(er){
          if(er){
          alert(er);
          }
          else{
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
    //var username = template.find('#userSelect').valueOf();
    var username = template.find('#userSelect').value;
    Meteor.call('updateUserInProject', Session.get('currentproject'), username,role);
  },
//not working
  'submit #removeUserFromProjectFrm':function(event){
    event.preventDefault();
    var username = userSelectremove.options[userSelectremove.selectedIndex].text;
    var projectname = Projects.findOne({_id:Session.get("currentproject")}).projectname;
    var users = Projects.findOne({_id:Session.get("currentproject")}).userIds;

    Meteor.call('removeUserFromProject',projectname, username.username);
  },
  'submit #updateRoleInProjectFrm':function(event){
    event.preventDefault();
    var username = userSelectremove.options[userSelectremove.selectedIndex].text;
    var projectname = Projects.findOne({_id:Session.get("currentproject")}).projectname;
    var role = roleSelect.options[roleSelect.selectedIndex].text;
    var u = Meteor.Users.find({fisrtName: projectname,userIds: {$in: [user._id]}}).fetch();

    Meteor.call('removeUserFromProject',projectname, username,role);
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
      return Meteor.users.find({"projects.project._id":{$nin:[Session.get("currentproject")]}}).fetch();
    },
    'userToRemove':function(){
      return Projects.findOne({_id:Session.get("currentproject")}).userIds;
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
