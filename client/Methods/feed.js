Template.userFeedtemp.helpers({
  'nots':function(){
  var user = Meteor.users.findOne(Meteor.userId());
  var projs = user.projects;
  var notifs = user.notif.sort({projId:1});
  console.log(user)

return notifs.sort({projId:1});


/*


_.forEach(projs,function(v){
  _.forEach(notifs,function(v){


      })
    })*/
}
})
