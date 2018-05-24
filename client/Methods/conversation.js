
Template.addProjectReqModal.events({
'click #addRequirementBtn':function(event,template){
  event.preventDefault();

  var projId =Session.get('currentproject');
  var roomname = template.find('#requirementname').value;
  var descrpition = template.find('#requirementDescrpition').value;
  var isFunc= template.find('#isFunc').checked;
  var reqScore= template.find('#requiredScore').value;

    if(!isFunc){
          var cat= template.find('#catSelect').value;
          if(cat == "Select Category"){
            alert("Please choose a category")
          }
      }
  var user = Meteor.user();
  if(reqScore>100){
    alert("Score off limits");
    return;
  }
//console.log(user);
//console.log(projId, roomname, descrpition, isFunc,reqScore,cat);
$("#addProjectReqModal").modal("hide");
if(cat == "Select Category")
{
  cat=null;
}

if(roomname != "" && descrpition != "" && reqScore != ""){
   Meteor.call('createConversation',projId ,roomname, descrpition,isFunc,reqScore,cat,user,function(er){
    if(er){
    alert(er);
    }
    else{
      template.find('#requirementname').value = "";
      template.find('#requirementDescrpition').value = "";
      template.find('#isFunc').checked = false;
      template.find('#requiredScore').value = false;
      template.find('#catSelect').value = "";

      alert("Added successfully");
    }});
  }else{
    alert("You should fill all the fields");
  }
  }
});

Template.removeReqModal.events({
  'click #rmvReqNoBtn':function(event){
    event.preventDefault();
    $("#removeReqModal").modal("hide");
  },
'click #rmvReqYesBtn': function(event){
  event.preventDefault();
  var projId =Session.get('currentproject');
  var reqId=Session.get('roomid');
  Meteor.call('removeReq',reqId, projId,function(er){

    if(er){
    alert(er);
    }
    else{
      $("#removeReqModal").modal("hide");
      alert("Removed successfully");
    }
})
}
});
