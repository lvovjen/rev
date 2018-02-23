import moment from 'moment'

Template.usersManagement.onCreated(function() {
  this.autorun(() => {
    this.subscribe('allUsers');
  });
});

Template.usersManagementTemp.helpers({
  users: function() {
    return Meteor.users.find({},{sort:{lastName:1}});
  },
  userEmail: function() {
    return this.emails[0].address;
  },
  admin: function() {
    return Roles.userIsInRole(this._id, 'admin') ? 'admin' : 'normal';
  },
  dateFormat: function() {
    return moment(this.createdAt).format('D M YYYY')
  }
})
Template.leadershipboardTemp.helpers({
  users: function() {
    return Meteor.users.find({},{sort:{score:1}});
  },
  userEmail: function() {
    return this.emails[0].address;
  },
  admin: function() {
    return Roles.userIsInRole(this._id, 'admin') ? 'admin' : 'normal';
  },
  dateFormat: function() {
    return moment(this.createdAt).format('D M YYYY')
  }
})
Template.addUser_btn.events = {
    'click #addUser_btn' : function() {
    event.preventDefault();
    $("#createUser").modal("show");
  }
};

/*  'click.user_id': function() {
    event.preventDefault();
    Session.set('currentUser', this);
  }
  'click.toggle-admin': function() {
    console.log(this._id);
    Meteor.call('toggleAdmin', this._id);
  }*/
