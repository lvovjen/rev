Template.prgSum.helpers({
  'p':function(){
    return Projects.findOne({_id:Session.get("currentproject")});
  },
  'reqsCF':function(){
    return ChatRooms.find({project:Session.get("currentproject"),completed:true,isFunc:true });
  },
  'reqsCNF':function(){
    return ChatRooms.find({project:Session.get("currentproject"),completed:true,isFunc:false},{sort:{cat:1}});
  }

});
Template.prgSum.events({
    'click #pdf': function (event){
      event.preventDefault();
    Blaze.saveAsPDF(Template.test, {
      filename: "document.pdf", // optional, default is "document.pdf"
      x: 0, // optional, left starting position on resulting PDF, default is 4 units
      y: 0, // optional, top starting position on resulting PDF, default is 4 units
      unit: "in", // optional, unit for coordinates, one of "pt", "mm" (default), "cm", or "in"
      format: "letter", // optional, see Page Formats, default is "a4",
      elementHandlers: specialElementHandlers
    });
}
});
