Template.editReqModal.events({
'click #editReqBtn':function(event,template){
  event.preventDefault();
 var reqname = template.find('#editReqname').value;
 var descrpition = template.find('#editReqDescrpition').value;
 var score = template.find('#editReqScore').value;
 var isF = template.find('#editIsFunc').checked;
if(!isF){
 var cat = template.find('#editCatSelect').value;
}
var r =ChatRooms.findOne({_id:Session.get('roomid')});
if(score>100){
  alert("Score off limits");
  return;
}
if(isF == false && cat == 'Select Category'){
  alert("Must choose category for non-functional requirement");
  return;
}
  //$("#editProjectModal").modal("hide");
 Meteor.call('editReq',Session.get('currentproject'),Session.get('roomid'),descrpition,reqname,score,cat,isF);
 Meteor.call('updateCompleted',r,Session.get('currentproject'));
},
'click #editIsFunc':function(event,template){
  if(template.find('#editIsFunc').checked){
    Session.set('isFunc',true);
    }else{
      Session.set('isFunc',false);
    }
  }
})

Template.editReqModal.helpers({
  'reqName':function(){
    return ChatRooms.findOne({_id:Session.get('roomid')}).roomName;
  },
  'reqDesc':function(){
    return ChatRooms.findOne({_id:Session.get('roomid')}).descrpition;
  },
  'reqScore':function(){
    return ChatRooms.findOne({_id:Session.get('roomid')}).reqScore;
  },
  'cat':function(){
    return ChatRooms.findOne({_id:Session.get('roomid')}).cat;
  },
  'isFunc':function(){
    return ChatRooms.findOne({_id:Session.get('roomid')}).isFunc;
  },
  'category':function(){
    return Projects.findOne({_id:Session.get("currentproject")}).categories;
  }
});


Template.editReqModal.onRendered(function(){
  Session.set('isFunc',ChatRooms.findOne({_id:Session.get('roomid')}).isFunc);
});
