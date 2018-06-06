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
    return Projects.find({active:true},{sort:{projectname:1}});
  },
  'nonActPro': function() {
    return Projects.find({active:false},{sort:{projectname:1}});
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
      return "Show Active Projects"
    }
    return "Show Archived Projects";
  }
});

Template.removeProj_Btn.helpers({
    'prjActiveLbl' : function() {
			if(Projects.findOne({_id:this._id}).active){
				return "fa fa-arrow-circle-o-down";
			}else{
				return "fa fa-arrow-circle-o-up";
			}
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
Template.removeProjConfirmationModal.helpers({
  'act':function(){
      return Projects.findOne({_id:Session.get('currentproject')}).active;
    }
});
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

