ChatRooms = new Mongo.Collection('chatrooms');
Projects = new Mongo.Collection('projects');
Subscriptions = new Mongo.Collection('subscriptions');
General = new Mongo.Collection('general');
//var imagesStorage = new FS.Store.GridFS("images");
Images = new FS.Collection("images",{
stores:[new FS.Store.FileSystem("images")]
});


Images.allow({
    insert: function(userId, fileObj) {
        return !!userId; // we could check fileObj.metadata.owner?
    },
    update: function(userId, fileObj) {
        return !!userId;
    },
    remove: function(userId, fileObj) {
        return !!userId;
    },
    // Allow eg. only the user in metadata
    // the shareId is being discussed - eg. for sharing urls
    download: function(userId, fileObj/*, shareId*/) {
        return true;
    },
    fetch: []
});
