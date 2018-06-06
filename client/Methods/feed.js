

Template.userFeed.onRendered(function() {
  Session.set('levels',true);
  Session.set('ldrbrd',true);
  Session.set('badges',true);

});


Platform = {
  isIOS: function () {
    return (!!navigator.userAgent.match(/iPad/i) || !!navigator.userAgent.match(/iPhone/i) || !!navigator.userAgent.match(/iPod/i))
           || Session.get('platformOverride') === 'iOS';
  },

  isAndroid: function () {
    return navigator.userAgent.indexOf('Android') > 0
           || Session.get('platformOverride') === 'Android';
  }
};

Template.registerHelper('isIOS', function () {
  return Platform.isIOS();
});

Template.registerHelper('isAndroid', function () {
  return Platform.isAndroid();
});


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
  },
    'proj':function(){
    if(this.type == 'proj')
      {
             return true;
      }
       return false;
  }
});

Template.userFeedtempMobile.helpers({

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
  },
    'proj':function(){
    if(this.type == 'proj')
      {
             return true;
      }
       return false;
  }
});
