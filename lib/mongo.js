ChatRooms = new Mongo.Collection('chatrooms');
Projects = new Mongo.Collection('projects');
Subscriptions = new Mongo.Collection('subscriptions');
General = new Mongo.Collection('general');
//var imagesStorage = new FS.Store.GridFS("images");
Images = new FS.Collection("images",{
stores:[new FS.Store.FileSystem("images", {path: "~/uploads"})]
});
