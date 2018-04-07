Meteor.methods({
  toggleAdmin(id){
    if(Roles.userIsInRole(id,'admin')){
      Roles.removeUsersFromRoles(id,'admin');
    }else
    {
      Roles.addUsersToRoles(id,'admin');
    }
  },
  saveGen:function(x,score){
    General.update({_id:x},{$set:{score:score}})
    if(x=="nonfunScore" || x=="funScore"){
      Meteor.call('scoreRecalc');
    }
  },
  getLshpbrd:function(){
    return General.findOne({_id:"leaderBrd"}).score;
  },
  setVar:function(x){
    General.findOne({_id:"leaderBrd"},{$set:{score:x}});
  }
})
/*Router.onBeforeAction(function() {
  var someDynamicValue = "FOO";
  setPageTitle(someDynamicValue);
});*/
