Template.userFeedtemp.helpers({
  'nots':function(){
    var x = Meteor.users.findOne({_id:Meteor.userId()}).notif;
    return _.sortBy(x, e => e.startDate).reverse();
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
})
Template.userFeed.helpers({
  'c1':function(){
  if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge1"}).fetch().length == 0){
        return '#fff';
      }
  return '#61ff2b69';
},
'c2':function(){
if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge2"}).fetch().length == 0){
      return '#fff';
    }
return '#61ff2b69';
},
'c3':function(){
if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge3"}).fetch().length == 0){
      return '#fff';
    }
return '#61ff2b69';
},
'c4':function(){
if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge4"}).fetch().length == 0){
      return '#fff';
    }
return '#61ff2b69';
},
'b1':function(){
  return General.findOne({_id:"badge1"}).score;
},'b2':function(){
  return General.findOne({_id:"badge2"}).score;
},'b3':function(){
  return General.findOne({_id:"badge3"}).score;
}
})
