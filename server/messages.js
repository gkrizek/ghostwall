Meteor.publish("messages", function (recipient) {
    var recipient = recipient;
    check(recipient, String);
    var userId = this.userId;
    var date = new Date();
    if (userId){
    var sender = Meteor.users.findOne({_id: userId}, {fields: {'username': 1}});
    var room = Rooms.find({"participants.user": {$all: [recipient, sender.username]}}, {fields: {_id: 1}}).fetch();
    if (room.length == 0){
      var room = Rooms.insert({participants: [{user: sender.username, unread: false, visible: false}, {user: recipient, unread: false, visible: false}], when: date});
      return Messages.find({room: room}, {fields: {'room': 0}});
    }else{
    return Messages.find({room: room[0]._id}, {fields: {'room': 0}});
    }
  }
});

Meteor.methods({

  'newMessage': function(){
    var arr = [];
    var user = Meteor.user().username;
    var rooms = Rooms.find({"participants": {$elemMatch:{"user": user}}}).fetch();
    var arrayLength = rooms.length;
    for (var i = 0; i < arrayLength; i++) {
      var result = rooms[i].participants;
      if (result[0].user == user){
        if (result[1].unread == true){
          return true;
        }
      }else{
        if (result[0].unread == true){
          return true;
        }
      }
    }
  },

  'resetBadge': function(){
    var user = Meteor.userId();
    Meteor.users.update({_id: user}, {$set: {'badge': 0}});
    Push.send({
      from: "",
      title: "",
      text: "",
      badge: 0,
      query: {
        userId: user
      }
    });
  },

'findContacts': function(){
  var arr = [];
  var user = Meteor.user().username;
  var contacts = Rooms.find({"participants": {$elemMatch:{"user": user}}}, {sort: {"when": -1}}).fetch();
    var arrayLength = contacts.length;
    for (var i = 0; i < arrayLength; i++) {
      var result = contacts[i].participants;
      if (result[0].user == user){
        if (result[1].visible == true){
          arr.push(result[1]);
        }
      }else{
        if (result[0].visible == true){
          arr.push(result[0]);
        }
      }
    }
  //Only returns the custom made array of usernames
    return arr;
  },

  'updateReadStatus': function(user){
    var sender = Meteor.user().username;
    var recipient = user;
    check(user, String);
    var newRoom = Rooms.find({"participants.user": {$all: [recipient, sender]}}, {fields: {_id: 1}}).fetch();
    var room = newRoom[0]._id;
    Rooms.update({'_id': room, "participants.user": recipient}, {$set: {"participants.$": {"user": recipient, "unread": false, "visible": true}}});
  },

  'insertMessage': function(message, recipient){
    var message = message;
    check(message, String);
    var recipient = recipient;
    check(recipient, String);
    var sender = Meteor.user().username;
    if (recipient == sender) {
      return false;
    }else{
    var ipAddr = "0.0.0.0";
    var newRoom = Rooms.find({"participants.user": {$all: [recipient, sender]}}, {fields: {_id: 1}}).fetch();
    var room = newRoom[0]._id;
    Messages.insert({room: room, message: message, sender: sender, recipient: recipient, clientIp: ipAddr});
    }
    //send notification
    var curBadge = Meteor.users.findOne({'username': recipient}, {fields: {badge: 1}});
    var badge = curBadge.badge + 1;
    Meteor.users.update({'username': recipient}, {$set: {'badge': badge}});
    Push.send({
        from: 'Ghostwall',
        title: 'New Message',
        text: sender+' sent you a message.',
        badge: badge,
        apn: {
          sound: "www/application/app/push.wav"
        },
        gcm: {
          sound: "push"
        },
        query: {
            userId: curBadge._id
        }
    });
  },

  'updateRoom': function(recipient){
    var recipient = recipient;
    check(recipient, String);
    var sender = Meteor.user().username;
    var newRoom = Rooms.find({"participants.user": {$all: [recipient, sender]}}, {fields: {_id: 1}}).fetch();
    var room = newRoom[0]._id;
    var date = new Date();
    Rooms.update({'_id': room}, {$set: {"when": date}});
    Rooms.update({'_id': room, "participants.user": sender}, {$set: {"participants.$": {"user": sender, "unread": true, "visible": true}}});
  },

  'checkUsername': function(username){
    var username = username;
    check(username, String);
    var test = Meteor.users.findOne({username: username});
    if(test){
      return true;
    }else{
      return false;
    }
  },

  'deleteContact': function(contact){
    var contact = contact;
    check(contact, String);
    var user = Meteor.user().username;
    var room = Rooms.find({"participants.user": {$all: [user, contact]}}, {fields: {_id: 1}}).fetch();
    Rooms.update({_id: room[0]._id, "participants.user": contact}, {$set: {"participants.$": {user: contact, unread: false, visible: false}}});
    Messages.remove({room: room[0]._id});
  }
});
