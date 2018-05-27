import moment from 'moment'

Template.usersManagement.onCreated(function() {
  this.autorun(() => {
    this.subscribe('allUsers');
  });
});

Template.usersManagement.onRendered(function() {
    Session.set("archiveUsr", false);
});

Template.usersManagementTemp.helpers({

  userEmail: function() {
    return this.emails[0].address;
  },
  admin: function() {
    return Roles.userIsInRole(this._id, 'admin') ? 'admin' : '';
  },
  dateFormat: function() {
    return moment(this.createdAt).format('D/ M/ YYYY')
  }
})

Template.leadershipboardTemp.helpers({
  users: function() {
    return Meteor.users.find({},{sort:{"profile.score":-1}});
  },
  userEmail: function() {
    return this.emails[0].address;
  },
  admin: function() {
    return Roles.userIsInRole(this._id, 'admin') ? 'admin' : 'normal';
  },
  dateFormat: function() {
    return moment(this.createdAt).format('D M YYYY')
  },
  clr:function() {
    if(this._id == Meteor.userId()){
      return "#03a9f430";
    }else{
      return "#f9f9f9"
    }
  }
})

Template.addUser_btn.events = {
    'click #addUser_btn' : function() {
    event.preventDefault();
    $("#addUserModal").modal("show");
  }
};

Template.resetAllScoreConfirmationModal.events({
    'click #confirmResetBtn' : function() {
    event.preventDefault();
    $("#resetAllScoreConfirmationModal").modal("hide");
    Meteor.call('resetAllScore');
  }
})

Template.removeUserConfirmationModal.events = {
    'click #confirmRemoveUserBtn' : function() {
    event.preventDefault();
    $("#removeUserConfirmationModal").modal("hide");
  Meteor.call('removeUser',Session.get('usrMgmt'));
  }
};

Template.resetAllScore_btn.events = {
    'click #resetAllScore_btn' : function() {
    event.preventDefault();
    $("#resetAllScoreConfirmationModal").modal("show");
  }
};

Template.removeUser_Btn.events = {
    'click #removeUser_Btn' : function() {
    event.preventDefault();
    $("#removeUserConfirmationModal").modal("show");
  }
};

Template.diactivate_Btn.events = {
    'click #diactivate_Btn' : function() {
    event.preventDefault();
		Meteor.call('updateActiveUsr',Session.get('usrMgmt'));
	}
};
Template.diactivate_Btn.helpers = {
    'usrActiveLbl' : function() {
		console.log(this + "fsfdfsfs");
			/*if(Meteor.users.findOne({_id:this._id}).active){
				console.log("true");
				return "fa fa-arrow-circle-o-down"
			}else{
					console.log("false");

				return "fa fa-arrow-circle-o-up"
			}*/
		}
};
Template.archiveUsr_btn.events({
  'click #archiveUsr_btn': function(event) {
    if(Session.get("archiveUsr")){
      Session.set('archiveUsr',false);
      return;
    }
    Session.set("archiveUsr", true);
  }
});

Template.archiveUsr_btn.helpers({
  'btnLbl': function() {
    if(Session.get("archiveUsr")){
      return "Active"
    }
    return "Archive";
  }
});


Template.usersManagementTemp.events = {
    'click #editUser_Btn' : function() {
    event.preventDefault();
    $("#editUserModal").modal("show");
    },
    'click #usrsTbl': function(event) {
      Session.set("usrMgmt", this._id);
    }
};
