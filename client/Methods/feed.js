

Template.userFeed.onRendered(function() {
  Session.set('levels',true);
  Session.set('ldrbrd',true);
  Session.set('badges',true);

});

/*
Template.userFeed.onCreated(function() {
console.log("in oncreate")
  console.log(Session.set('badges',true));
  Session.set('levels',true);
  Session.set('ldrbrd',true);
});
*/
Template.userFeedtemp.helpers({
  'nots':function(){
  var x = Meteor.users.findOne({_id:Meteor.userId()}).notif;
  return _.sortBy(x, e => e.startDate).reverse();
  },
  'isNots':function(){
    var x = Meteor.users.findOne({_id:Meteor.userId()}).notif;
    if(x.length > 0){
      console.log("true");
    return true;
  }else{
    console.log("false");

   return false;
 }
},
 'vote':function(){
     if(this.type == 'vote')
        {
                return true;
        }
      return false;
  },
  timestampFixed: function() {
    return moment(this.timestamp).format('h:mma DD/MM/YYYY');
  },
  'bdg':function(){
    if(this.type == 'bdg')
      {
             return true;
      }
       return false;
  }
});
