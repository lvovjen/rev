
Template.editProjectModal.onCreated(function() {
  this.autorun(() => {
    this.subscribe('projects');
    this.subscribe('allUsers');
      });
});


Template.editProjectModal.events({
'click #editProjectBtn':function(event,template){
      event.preventDefault();
      var projectname = template.find('#editProjectname').value;
      var descrpition = template.find('#editprojectDescrpition').value;

      var lvl = template.find('#isLvl').checked;
      var bdgs = template.find('#isBdgs').checked;
      var ldrbrd = template.find('#isLdrb').checked;


      if(!((lvl && Projects.findOne({_id:Session.get('currentproject')}).levelsEl) || (!lvl && !Projects.findOne({_id:Session.get('currentproject')}).levelsEl))){
          Meteor.call('changelevelsEl',Session.get('currentproject'),lvl);
      }
      if(!((bdgs && Projects.findOne({_id:Session.get('currentproject')}).badgesEl) || (!bdgs && !Projects.findOne({_id:Session.get('currentproject')}).badgesEl))){
          Meteor.call('changebadgesEl',Session.get('currentproject'),bdgs);
      }
      if(!((ldrbrd && Projects.findOne({_id:Session.get('currentproject')}).leaderBrdEl) || (!ldrbrd && !Projects.findOne({_id:Session.get('currentproject')}).leaderBrdEl))){
          Meteor.call('changeleaderBrdEl',Session.get('currentproject'),ldrbrd);
      }

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
      },
      'isLvl':function(){
      return Projects.findOne({_id:Session.get('currentproject')}).levelsEl;
      },
      'isBdgs':function(){
        return Projects.findOne({_id:Session.get('currentproject')}).badgesEl;
      },
      'isLdrb':function(){
        return Projects.findOne({_id:Session.get('currentproject')}).leaderBrdEl;
      }
})
