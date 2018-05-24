import moment from 'moment'

Template.usersManagement.onCreated(function() {
  this.autorun(() => {
    this.subscribe('allUsers');
  });
});

Template.usersManagementTemp.helpers({
  users: function() {
    return Meteor.users.find({},{sort:{"profile.lastName":-1}});
  },
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
      return "#f0fa4abd";
    }else{
      return "#f9f9f9"
    }
  },
  avat: function() {
    if(this.profile.avatar == "avatarLogo.gif"){
      return false;
    }
    return true;
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



Template.usersManagementTemp.events = {
    'click #editUser_Btn' : function() {
    event.preventDefault();
    $("#editUserModal").modal("show");
    },
    'click #usrsTbl': function(event) {
      Session.set("usrMgmt", this._id);
    }
};
