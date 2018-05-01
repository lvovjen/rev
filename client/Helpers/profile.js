Template.sidebarBoot.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
  });
});


Template.profileModal.helpers({
'u':function(){
  return Meteor.users.findOne({_id:Meteor.userId()});
},
    'userEmail': function() {
      return Meteor.user().emails[0].address;
    },
    'project': function() {
      return Meteor.users.findOne({_id:Meteor.userId()}).projects;
    },
    'img':function(){
  //    var x =Meteor.users.findOne({_id:Meteor.userId()}).profile.avatar;
      return Meteor.users.findOne({_id:Meteor.userId()});
    }
  });


Template.profileModal.events({
  'change .myFileInput': function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        if(!err){
          var userId=Meteor.userId();
        //  var x = Images.find({_id:fileObj._id});
    //            fileObj.metadata = { owner: Meteor.userId() };
         var imageurl = {
            'profile.avatar':'/cfs/files/images/'+fileObj._id
          }

          setTimeout(function(){
            Meteor.users.update(userId,{$set:imageurl});
          })
        }
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    }
  }
});
