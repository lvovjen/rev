import moment from 'moment'

Template.projsManagement.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});

Template.projsManagementTemp.helpers({
  'project': function() {
    return Projects.find({});
  },
  'dateFormat': function() {
    return moment(this.createdAt).format('D M YYYY')
  }
})

Template.projsManagementTemp.events({
  'click #projsTbl': function(event) {
    Session.set("currentproject", this._id);
  }
})
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
