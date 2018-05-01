Template.generalMng.helpers({
  'all':function(){
    return General.find({});
  },
  'score':function(){
    if(this.score == '1'){
      return '1';
    }
    if(this.score == true){
      return 'Enabled';
    }
    return this.score;
  }
})
Template.editGenModal.helpers({
  'genVar':function(){
    var x=General.findOne({_id:Session.get('genVar')}).name;
    return x;
  }
})
Template.editGenVarModal.helpers({
  'status':function(){
    var x=General.findOne({_id:Session.get('genVar')}).score;
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
  if(a>=3 && a<=10000)
    {
      Meteor.call("saveGen",Session.get('genVar'),a)
      template.find('#scNew').value = '';

    }else{
      alert("Please enter a number (3,10000)")
    }
  }
}

Template.editGenVarModal.events= {
'click #saveVarGen': function(event,template){
  event.preventDefault();
  $("#editGenModal").modal("hide");
  var x = Session.get('genVar');
  var y = template.find('#dis_en').value;
        if(y=="Disable")
        {
          Meteor.call('setVar',x, false,function(er){
            if(er){
              alert("Something went wrong");
            }else{
                  Session.set(x,false);
            };
        });
      }
        if(y=="Enable")
        {
           Meteor.call('setVar',x,true,function(er){
             if(er){
               alert(er);
             }else{
               Session.set(x,true);
             }
           });
        };
        if(y=="Change"){
          alert("No changes made")
        }
        $("#editGenModal").modal("hide");

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
'click #open_editldrbrdModal' : function() {
event.preventDefault();
$("#editGenVarModal").modal("show");
Session.set('genVar',"ldrbrd")
},
'click #open_editlevelsModal' : function() {
event.preventDefault();
$("#editGenVarModal").modal("show");
Session.set('genVar',"levels")
},
'click #open_editbadge1Modal' : function() {
event.preventDefault();
$("#editGenModal").modal("show");
Session.set('genVar',"badge1")
},
'click #open_editbadge2Modal' : function() {
event.preventDefault();
$("#editGenModal").modal("show");
Session.set('genVar',"badge2")
},
'click #open_editbadge3Modal' : function() {
event.preventDefault();
$("#editGenModal").modal("show");
Session.set('genVar',"badge3")
}




};
