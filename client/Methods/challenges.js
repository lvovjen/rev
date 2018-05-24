Template.challenges.helpers({
  'c1':function(){
        if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge1"}).fetch().length == 0){
        return true;
      }
  return false;
  },
  'c2':function(){
        if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge2"}).fetch().length == 0){
        return true;
      }
    return false;
  },
  'c3':function(){
        if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge3"}).fetch().length == 0){
        return true;
      }
  return false;
  },
  'c4':function(){
        if(Meteor.users.find({_id:Meteor.userId(),"badges.bType":"badge4"}).fetch().length == 0){
        return true;
      }
  return false;
  },
  'b1':function(){
    return General.findOne({_id:"badge1"}).score;
  },
  'b2':function(){
    return General.findOne({_id:"badge2"}).score;
  },
  'b3':function(){
    return General.findOne({_id:"badge3"}).score;
  },
  'b4':function(){
    return General.findOne({_id:"badge4"}).score;
  }

})
