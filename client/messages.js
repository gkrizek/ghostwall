function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

Template.contacts.onCreated(function(){

   Meteor.call('resetBadge');
   Meteor.call("findContacts", function(error, result){
        if(error){
          Bert.alert( error.reason, 'danger', 'fixed-top' );
        }else{
          Session.set('contactsArray', result);
        }
      });

      Meteor.call('newMessage', function(error, result){
        if(error){
          console.log(error);
        }else{
          if(result == true){
            Session.set('newMessage', true);
          }else{
            Session.set('newMessage', false);
          }
        }
      });
});

Template.contacts.helpers({
  contact: function(){
        var contactsArray = Session.get('contactsArray');
        return contactsArray;
    },

    isUnread: function (unread) {
      return unread == true;
    },

   'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   }
 });

Template.contacts.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #deletecontact': function(e){
    e.preventDefault();
    var user = this.user;
    var conf = confirm('When deleting a conversation, all messages from both users are permanently erased. Are you sure you want to delete this converstaion?');
    if(conf == true){
      Meteor.call('deleteContact', user);
      FlowRouter.go('/ghostwall');
      FlowRouter.go('/contacts');
    }
  },

    'click #logout': function(){
      Session.set('isLoggedIn', false);
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }

});

Template.messages.onRendered(function(){

  Meteor.call('resetBadge');
  var recipient = Session.get("user");
  Meteor.call('checkUsername', recipient, function(error, result){
    if(error){
      console.log(error);
    }else{
      //this runs both no matter what result is
      if(result === true){
        if(isValid){
          Meteor.subscribe("messages", recipient);
          Meteor.call('updateReadStatus', recipient);
        }else{
          Bert.alert( 'There was a problem loading this chat.', 'danger', 'fixed-top' );
        }
        function isValid(str) { return /^\w+$/.test(str); }
      }else{
        FlowRouter.go('/contacts');
        Bert.alert('Couldn\'t find user', 'danger', 'fixed-top');
      }
   }
  });

sleep(300).then(() => {
    $(".bottomofpage")
    .velocity("scroll", {duration: 300})
    .velocity({ opacity: 1 });
});

});

Template.messages.onDestroyed(function(){
  var recipient = Session.get("user");
  Meteor.call('updateReadStatus', recipient);
});

Template.messages.helpers({
  messages: function() {
      var recipient = Session.get('user');
      var sender = Meteor.user().username;
      var messages = Messages.find({$and: [{'sender':{"$in":[recipient, sender]}},{'recipient':{"$in":[recipient, sender]}}]}, {sort: {createdAt: 1}}).fetch();
      return messages;
    },

  isMe: function (sender) {
    var me = Meteor.user().username;
    return sender == me;
  },

  recipient: function(){
    var user = Session.get('user');
    return user;
  }
});

Template.messages.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #sendbutton': function(){
    Meteor.call('resetBadge');
    var message = $('[id=newtext]').val();
    var recipient = Session.get('user');
    if(message.length > 0){
    Meteor.call('insertMessage', message, recipient, function(error){
      if(error){
        if(error.reason){
          Bert.alert(error.reason, 'danger', 'fixed-top' );
        }else{
          Bert.alert("There was a problem sending this message. Please try again later.", 'danger', 'fixed-top' );
        }
      }else{
        Meteor.call('updateReadStatus', recipient);
        Meteor.call("updateRoom", recipient);
        $('[id=newtext]').val('');
          $(".bottomofpage")
             .velocity("scroll", {duration: 300})
             .velocity({ opacity: 1 });

      }
    });
  }else{
    Bert.alert('Messages can\'t be empty', 'danger', 'fixed-top');
  }
  },

    'click #logout': function(){
      Session.set('isLoggedIn', false);
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }
});
