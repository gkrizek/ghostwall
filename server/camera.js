Meteor.methods({
	'insertPhoto': function(name, local, fileName){
	var name = name;
	check(name, String);
	var local = local;
	check(local, Object);
  var url = "https://s3.us-east-2.amazonaws.com/s3bucket/" + fileName;
  var fileName = fileName;
  check(fileName, String);
	var user = Meteor.user();
  var ipAddr = "0.0.0.0";
  var object = ({owner: user._id, username: user.username, filename: fileName, title: name, url: url, time: 10, points: 0, views: 0, upvoters: [], downvoters: [], viewers: [], clientIp: ipAddr, loc: {type: "Point", coordinates: [local.lng, local.lat]}, type: 'photo'});
  Photos.insert(object);
},

'insertVideo': function(name, local, fileName){
	var name = name;
	check(name, String);
	var local = local;
	check(local, Object);
	var fileName = fileName;
	check(fileName, String);
	var user = Meteor.user();
  var ipAddr = "0.0.0.0";
  var url = "https://s3.us-east-2.amazonaws.com/s3bucket/" + fileName;
  var object = ({owner: user._id, username: user.username, filename: fileName, title: name, url: url, points: 0, views: 0, upvoters: [], downvoters: [], viewers: [], clientIp: ipAddr, loc: {type: "Point", coordinates: [local.lng, local.lat]}, type: 'video'});
  Photos.insert(object);
},

'insertAvatar': function(url){
  var url = url;
  check(url, String);
  var user = Meteor.userId();
  var old = Meteor.users.findOne({_id: user}, {fields: {'avatar': 1}});
  Old.insert({'avatar': old.avatar});
  Meteor.users.update({_id: user}, {$set: {avatar: url}});
}
});


Slingshot.fileRestrictions("photoUpload", {
  allowedFileTypes: ["image/png"],
  maxSize: 2 * 1024 * 1024,
});

Slingshot.createDirective("photoUpload", Slingshot.S3Storage, {
  AWSAccessKeyId: "AKIAAWSKEY",
  AWSSecretAccessKey: "AWSSECRETKEY",
  bucket: "s3bucket",
  acl: "private",
  region: "us-east-2",

    authorize: function () {
    if (!this.userId) {
      var message = "Please login before posting images";
      throw new Meteor.Error("Login Required", message);
    }
    return true;
  },

  key: function (file) {
    var fileName = Random.id([17]) + ".png";
    return fileName;
  }

});

Slingshot.fileRestrictions("albumUpload", {
  allowedFileTypes: ["image/png"],
  maxSize: 2 * 1024 * 1024,
});

Slingshot.createDirective("albumUpload", Slingshot.S3Storage, {
  AWSAccessKeyId: "AKIAAWSKEY",
  AWSSecretAccessKey: "AWSSECRETKEY",
  bucket: "s3bucket",
  acl: "private",
  region: "us-east-2",

    authorize: function () {
    if (!this.userId) {
      var message = "Please login before posting images";
      throw new Meteor.Error("Login Required", message);
    }
    return true;
  },

  key: function (file) {
    var fileName = Random.id([17]) + ".png";
    return fileName;
  }

});


Slingshot.fileRestrictions("videoUpload", {
  allowedFileTypes: ["video/mp4"],
  maxSize: 100 * 1024 * 1024,
});

Slingshot.createDirective("videoUpload", Slingshot.S3Storage, {
  AWSAccessKeyId: "AKIAAWSKEY",
  AWSSecretAccessKey: "AWSSECRETKEY",
  bucket: "s3bucket",
  acl: "private",
  region: "us-east-2",

    authorize: function () {
    if (!this.userId) {
      var message = "Please login before posting images";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function () {
    var fileName = Random.id([17]) + ".mov";
    return fileName;
  }

});


Slingshot.fileRestrictions("avatarUpload", {
  allowedFileTypes: ["image/png"],
  maxSize: 2 * 1024 * 1024,
});

Slingshot.createDirective("avatarUpload", Slingshot.S3Storage, {
  AWSAccessKeyId: "AKIAAWSKEY",
  AWSSecretAccessKey: "AWSSECRETKEY",
  bucket: "s3bucket",
  acl: "private",
  region: "us-east-2",

    authorize: function () {
    if (!this.userId) {
      var message = "Please login before posting images";
      throw new Meteor.Error("Login Required", message);
    }
    return true;
  },

  key: function (file) {
    var fileName = this.userId +'-'+ Random.id([10]) + ".png";
    return fileName;
  }

});
