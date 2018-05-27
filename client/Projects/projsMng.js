import moment from 'moment'

Template.projsManagement.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});
Template.projsManagement.onRendered(function() {
    Session.set("archivePro", false);
});

Template.projsManagementTemp.helpers({
  'activePro': function() {
    return Projects.find({active:true});
  },
  'nonActPro': function() {
    return Projects.find({active:false});
  },
  'dateFormat': function() {
    return moment(this.createdAt).format('D M YYYY')
  },
  'archivePro':function(){
    return Session.get('archivePro');
  }
})

Template.projsManagementTemp.events({
  'click #projsTbl': function(event) {
    Session.set("currentproject", this._id);
  }
})

Template.archivePro_btn.events({
  'click #archivePro_btn': function(event) {
    if(Session.get("archivePro")){
      Session.set('archivePro',false);
      return;
    }
    Session.set("archivePro", true);
  }
});

Template.archivePro_btn.helpers({
  'btnLbl': function() {
    if(Session.get("archivePro")){
      return "Active"
    }
    return "Archive";
  }
});


Template.infoPro_btn.events = {
    'click #infoPro_btn' : function() {
    event.preventDefault();
    $("#projectInfoModal").modal("show");
  }
};
Template.addProject_btn.events = {
    'click #addProject_btn' : function() {
    event.preventDefault();
    $("#addProjectModal").modal("show");
  }
};
Template.removeProjConfirmationModal.helpers={
  'act':function(){
      return this.active;
    }
}
Template.removeProj_Btn.events = {
    'click #removeProj_Btn' : function() {
    event.preventDefault();
    $("#removeProjConfirmationModal").modal("show");
  }
};
Template.removeProjConfirmationModal.events = {
    'click #confirmRemoveProjoBtn' : function() {
    event.preventDefault();
    $("#removeProjConfirmationModal").modal("hide");
    Meteor.call('diactivateProject',Session.get('currentproject'));
  }
};
Template.editProjBtn.events = {
    'click #editProjBtn' : function() {
    event.preventDefault();

    Session.get('this._id');
    $("#editProjectModal").modal("show");
  }
};
/*
Template.usersManagementTemp.events = {
    'click #editUser_Btn' : function() {
    event.preventDefault();
    $("#editUserModal").modal("show");
  },
  'click #usrsTbl': function(event) {
    Session.set("usrMgmt", this._id);
  }
};
*/
