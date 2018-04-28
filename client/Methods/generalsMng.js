Template.generalMng.helpers({
  'all':function(){
    return General.find({});
  }
})
Template.editGenModal.helpers({
  'genVar':function(){
    var x=Session.get('genVar');
    return x;
  }
})
Template.editGenVarModal.helpers({
  'status':function(){
    var x=General.findOne({_id:"leaderBrd"}).score;
    if(x){
      return "Enabled";
  }else{
    return "Disabled";
  }
  }
})


Template.editGenModal.events= {
'click #saveGen': function(event,template){
  event.preventDefault();
  $("#editGenModal").modal("hide");
  var a = template.find('#scNew').value;
  if(a>=0 && a<=10000)
    {
      Meteor.call("saveGen",Session.get('genVar'),a)
    }else{
      alert("Please enter a number")
    }
  }
}

Template.editGenVarModal.events= {
'click #saveVarGen': function(event,template){
  event.preventDefault();
  $("#editGenModal").modal("hide");
  var x = Session.get('genVar');
  var y = template.find('#dis_en').value;
  if(x == "leaderBrd"){
        if(y=="Disable")
        {
          Meteor.call('setVar',false,function(er){
            if(er){
              alert("Something went wrong");
            }else{
                            Session.set('ldrbrd',false);
            };
        });
      }
        if(y=="Enable")
        {
           Meteor.call('setVar',true,function(er){
             if(er){
               alert(er);
             }else{
               Session.set('ldrbrd',true);
             }
           });
        };
        if(y=="Change"){
          alert("No changes made")
        }
      }
  }
}

Template.generalMng.events = {
    'click #open_editfunScoreModal' : function() {
    event.preventDefault();
    $("#editGenModal").modal("show");
    Session.set('genVar',"funScore")
  },
  'click #open_editnonfunScoreModal' : function() {
  event.preventDefault();
  $("#editGenModal").modal("show");
  Session.set('genVar',"nonfunScore")
  },
  'click #open_editkilouserModal' : function() {
  event.preventDefault();
  $("#editGenModal").modal("show");
  Session.set('genVar',"kilouser")
  },
  'click #open_editmegauserModal' : function() {
  event.preventDefault();
  $("#editGenModal").modal("show");
  Session.set('genVar',"megauser")
  },
  'click #open_editgigauserModal' : function() {
  event.preventDefault();
  $("#editGenModal").modal("show");
  Session.set('genVar',"gigauser")
  },
  'click #open_editterauserModal' : function() {
  event.preventDefault();
  $("#editGenModal").modal("show");
  Session.set('genVar',"terauser")
},
'click #open_editleaderBrdModal' : function() {
event.preventDefault();
$("#editGenVarModal").modal("show");
Session.set('genVar',"leaderBrd")
}

};
