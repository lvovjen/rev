Template.userFeedtemp.helpers({
  'nots':function(){
  var user = Meteor.users.findOne(Meteor.userId()).notif.sort({projId:1});
  var projs = user.projects;
  var notifs = user.notif.sort({projId:1});
  console.log(user)

//var groupedDates = notifs.find({_id:Meteor.userId()},{ $where: "val == 'vote'" }).count();


return notifs.sort({projId:1});
/*


_.forEach(projs,function(v){
  _.forEach(notifs,function(v){


      })
    })*/
}
})
