Meteor.methods({
 createSubsc: function(id, rid){
   if (Meteor.user()) {
     console.log("in if");
     var res = Subscriptions.findOne({rid: rid, id:id});
     if (res) {
       //already room exists
       console.log("exists");
     } else {
       console.log("not exists");
       //no room exists
       var newProject = Subscriptions.insert({
         createdAt: new Date(),
         u:
         {
           id:id,
           username:username
         },
         rid:rid,
         projectname: projectname,
       });
     }
   }
}});
