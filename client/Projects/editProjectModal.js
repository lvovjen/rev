Template.editProjectModal.events({
'click #editProjectBtn':function(event,template){
  event.preventDefault();
  var projectname = template.find('#editProjectname').value;
  var descrpition = template.find('#editprojectDescrpition').value;
  $("#editProjectModal").modal("hide");
  Projects.update({_id:Session.get('currentproject')},{$set:{descrpition:descrpition,projectname:projectname}});
}
})
Template.editProjectModal.helpers({
  'descValue':function(){
    return Projects.findOne({_id:Session.get('currentproject')}).descrpition;
  },
  'projName':function(){
    return Projects.findOne({_id:Session.get('currentproject')}).projectname;
  }
})
