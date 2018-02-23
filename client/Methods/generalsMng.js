Template.generalMng.helpers({
  'all':function(){
    return General.find({});
  }
})
Template.generalMng.events = {
    'click #open_editfunScoreModal' : function() {
    event.preventDefault();
    $("#editGenModal").modal("show");
  }
};
