Photos = new Mongo.Collection("photos");
Messages = new Mongo.Collection("messages");
Rooms = new Mongo.Collection("rooms");
Chat = new Mongo.Collection("chat");

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

Session.setDefault('itemLimit', 10);
Session.setDefault('maxDist', 50);
Session.setDefault('chatItemLimit', 25);
Session.setDefault('chatMaxDist', 50);
Session.setDefault('newMessage', false);

Meteor.startup(function(){

  if(Blaze._globalHelpers.isAndroid()){
    $('html').addClass("android");
  }else{
    $('html').addClass("ios");
  }

  Meteor.setInterval(function(){
      if (Meteor.status().connected == false){
       alert('Can\'t connect to the server. Please check your network settings.');
      }
     }, 15000);
});

Template.registerHelper('isAndroid',function(){
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
});

Template.webnotfound.onRendered(function(){
  window.location = 'https://ghostwall.io';
});

Template.home.events({
    'click #homebuttonlink': function(){
      cordova.InAppBrowser.open('https://ghostwall.io', '_system', 'location=no');
    },

    'click #down-arrow-1': function(){
      $(".loginpage")
      .velocity("scroll", {duration: 500})
      .velocity({ opacity: 1 });
    },

    'click #signin': function(event){
        event.preventDefault();
        var username = $('[name=mainusername]').val();
        var password = $('[name=mainpassword]').val();
        if (password.length > 0 && username.length > 0){
          if (isValid(username)){
            if (password.length >= 6){
              Meteor.loginWithPassword(username, password, function(error){
              if(error){
                  alert(error.reason);
                } else {
                  document.activeElement.blur();
                  $("input").blur();
                  FlowRouter.go('/ghostwall');
                }
             });
            }else{
              alert('Password must be at least 6 characters.');
            }
        }else{
          alert('Not a valid username.');
        }
    }else{
      alert('Please fill in all fields');
    }
    function isValid(str) { return /^\w+$/.test(str); }
  }
});

Template.register.events({
    'click #register': function(e){
        e.preventDefault();
        var email = $('[name=mainemail]').val();
        var username = $('[name=mainusername]').val();
        var password = $('[name=mainpassword]').val();
        var password2 = $('[name=mainverifypassword]').val();
        var avatar = "https://s3-us-east-2.amazonaws.com/avatar.ghostwall.io/default.svg";
        var hasemail = false;
        if (email.length > 0){
          var hasemail = true;
        }
        if (username.length > 0 && password.length > 0 && password2.length > 0){
            if(isValid(username)){
              if(username.length < 31){
                  if (password.length >= 6){
                     if (password === password2){
                        if (hasemail == true) {
                          if(validateEmail){
                              Accounts.createUser({
                                  username: username,
                                  email: email,
                                  password: password,
                                  points: 0,
                                  name: username,
                                  avatar: avatar,
                                  contacts: [],
                                  rooms: [],
                                  badge: 0
                              }, function(error){
                              if(error){
                                alert(error.reason);
                              } else {
                                 Meteor.call('sendVerificationLink');
                                 FlowRouter.go('/ghostwall');
                               }
                              });
                          }else{
                            alert('Not a valid email address.');
                          }
                        }else{
                          var conf = confirm("Are you sure you don't want to use an email? You can add one later, but until you add an email you can't reset your password.");
                          if(conf == true){
                              Accounts.createUser({
                                  username: username,
                                  email: email,
                                  password: password,
                                  points: 0,
                                  name: username,
                                  avatar: avatar,
                                  contacts: [],
                                  rooms: [],
                                  badge: 0
                              }, function(error){
                              if(error){
                                alert(error.reason);
                              } else {
                                 FlowRouter.go('/ghostwall');
                               }
                              });
                          }
                        }
                    }else{
                      alert('Passwords must match.');
                    }
                  }else{
                    alert('Passwords must be at least 6 characters.');
                  }
              }else{
                alert('Usernames can\'t be longer than 30 characters');
              }
            }else{
              alert('Usernames can only contain letters, numbers and underscores.');
            }
        }else{
          alert('Please fill in all fields');
        }
        function isValid(str) { return /^\w+$/.test(str); }
        function validateEmail(email) { return /^\w+@(.*)\.[a-zA-Z]{2,4}$/.test(email); }
      },

      'click #moreinfo': function(){
        $('#moreinfo-email').css('visibility', 'visible');
      },

      'click #moreinfo-email': function(){
        $('#moreinfo-email').css('visibility', 'hidden');
      }

});

Template.recover.events({
  'click #searchbutton': function(e){
    e.preventDefault();
    var email = $('[name=searchusername]').val();
    if (validateEmail(email)){
    Meteor.call('recoverEmail', email);
    Bert.alert( 'If that email exists and is verified, a reset link has been sent.', 'success', 'fixed-top' );
    FlowRouter.go('/');
  }else{
    Bert.alert( 'Please enter a valid email.', 'danger', 'fixed-top' );
   }
      function validateEmail(email) { return /^\w+@(.*)\.[a-zA-Z]{2,4}$/.test(email); }
   }
});

Template.people.onRendered(function(){
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

Template.people.helpers({
  'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   }
})

Template.people.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #searchbutton': function(e){
    e.preventDefault();
    var username = $('[name=searchusername]').val();
    if (isValid(username)){
      Meteor.call('findUser', username, function(error, response) {
            if (error) {
              Bert.alert(error.reason, 'danger', 'fixed-top' );
            }else{
                  FlowRouter.go('/profile/'+username);
            }
        });
      }else{
        Bert.alert( 'Not a valid username.', 'danger', 'fixed-top' );
      }
  //check if username is letters and numbers
  function isValid(str) { return /^\w+$/.test(str); }
  },

    'click #logout': function(){
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }
});

Template.settings.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #deletemyaccount': function(){
    var sure = confirm("YOU CAN'T UNDO THIS ACTION. \rAre you sure you want to delete your Ghostwall account?");
      if (sure == true){
       Meteor.call('deleteAccount', function(error){
        if(error){
          Bert.alert('There was a problem deleting your account. Please try again later.', 'danger', 'fixed-top');
        }else{
          Bert.alert('Successfully deleted account.', 'success', 'fixed-top');
          FlowRouter.go('/');
        }
       });
    }
  },

    'click #logout': function(){
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  },

  'click #resendVerification': function(){
    Session.set('loading', true);
    Meteor.call('resendVerification', function(error, result){
      if(error){
          Bert.alert(error, 'danger', 'fixed-top');
          Session.set('loading', false);
      }else{
        if(result == true){
          Bert.alert('Successfully resent verification email', 'success', 'fixed-top');
          Session.set('loading', false);
        }else{
          Bert.alert('Unable to resend verification email', 'danger', 'fixed-top');
          Session.set('loading', false);
        }
      }
    });
  },

  'click #uploadavatar': function(){
    var cameraOptions = {
        targetWidth: 1100,
        targetHeight: 1500,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true
      };
      navigator.camera.getPicture(avatarSuccess, avatarFailure, cameraOptions)
    Session.set('loading', true);
  },

  'click #terms': function(){
    cordova.InAppBrowser.open('https://ghostwall.io/terms.html', '_system', 'location=no');
  },

  'click #privacy': function(){
    cordova.InAppBrowser.open('https://ghostwall.io/privacy.html', '_system', 'location=no');
  },
});

Template.settings.onRendered(function() {
      Meteor.subscribe("userDoc");
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
//STOPPED HERE
Template.settings.helpers({
  'user': function(){
    var user = Meteor.user();
    return user;
  },

  'isVerified': function(verified){
    return verified == true;
  },

  'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   },

  'hasEmail': function(){
    var email = Meteor.users.find({'_id': Meteor.userId(), 'emails': {'$exists': true}}).count();
    if(email >= 1){
      return true
    }
  },

  'isLoading': function(state){
      var loading = Session.get('loading');
      return loading == state;
    }
});

Template.resetpasswordapp.events({
  'click #changebutton': function(e){
    e.preventDefault();
    var oldpassword = $('[name=oldpassword]').val();
    var password = $('[name=newpassword]').val();
    var password2 = $('[name=verifynewpassword]').val();
    if (password.length > 0 && password2.length > 0 && oldpassword.length > 0){
      if (password.length >= 6){
        if (password == password2){
          Accounts.changePassword(oldpassword, password, function(error){
                  if(error){
                    Bert.alert(error.reason, 'danger', 'fixed-top' );
                  }else{
                     Bert.alert( 'Password successfully changed!', 'success', 'fixed-top' );
                     FlowRouter.go('/account');
                };
              });
        }else{
          Bert.alert( 'Passwords must be the same.', 'danger', 'fixed-top' );
        }
      }else{
        Bert.alert( 'Password must be at least 6 characters long.', 'danger', 'fixed-top' );
      }
    }else{
      Bert.alert( 'Please fill in all fields.', 'danger', 'fixed-top' );
    }
  }
});

Template.profile.onRendered(function(){

  var user = Session.get("profile");
  Meteor.call('checkUsername', user, function(error, result){
    if(error){
      console.log(error);
    }else{
      if(result == true){
        if(isValid){
          Meteor.subscribe('userProfile', user);
        }else{
          Bert.alert( 'There was a problem loading this profile.', 'danger', 'fixed-top' );
        }
        function isValid(str) { return /^\w+$/.test(str); }
      }else{
        FlowRouter.go('/people');
        Bert.alert('Couldn\'t find user', 'danger', 'fixed-top');
      }
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

Template.profile.helpers({

  'user': function(){
    var username = Session.get('profile');
    var user = Meteor.users.findOne({username: username});
    return user;
  },

  'days': function(){
    Meteor.set
    var username = Session.get('profile');
    var user = Meteor.users.findOne({username: username}, {fields: {'createdAt': 1}});
    return user && moment(user.createdAt).fromNow();
  },

    'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   },

  isMe: function (sender) {
    var me = Meteor.userId();
    return sender == me;
  }
});

Template.profile.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

    'click #logout': function(){
      Session.set('isLoggedIn', false);
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }
});

Template.report.onRendered(function(){
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

Template.report.helpers({
  'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   }
})

Template.report.events ({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #report-send': function(e) {
    e.preventDefault();
    var reportname = $('[name=report-name]').val();
    var reportfield = $('[id=report-field]').val();
    var message = "ABUSE REPORT \r Message from: "+Meteor.user().username+"\r Reporting name: "+reportname+"\r Reason for report: "+reportfield;
    if (reportname.length > 0 && reportfield.length > 0){
      Meteor.call("reportEmail", message);
      Bert.alert( 'Report sent. Thank you!', 'success', 'fixed-top' );
      $('[name=report-name]').val('');
      $('[id=report-field]').val('');
    }else{
      Bert.alert( 'Please fill in all fields.', 'danger', 'fixed-top' );
    }
  },

    'click #logout': function(){
      Session.set('isLoggedIn', false);
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }
});

Template.support.onRendered(function(){
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

Template.support.helpers({
  'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   }
})

Template.support.events ({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #support-send': function(e) {
    e.preventDefault();
    var supportfield = $('[id=support-field]').val();
    var message = "SUPPORT REQUEST \r Message from: "+Meteor.user().username+"\r Reason for request: "+supportfield;
    if (supportfield.length > 0){
      Meteor.call("supportEmail", message);
      Bert.alert( 'Request sent. Thank you!', 'success', 'fixed-top' );
      $('[id=support-field]').val('');
    }else{
      Bert.alert( 'Please fill in all fields.', 'danger', 'fixed-top' );
    }
  },

  'click #supportbuttonlink': function(){
    cordova.InAppBrowser.open('https://ghostwall.io', '_system', 'location=no');
  },

  'click #support-field': function(){
    sleep(300).then(() => {
          $("#top-scroll")
          .velocity("scroll", {duration: 300})
          .velocity({ opacity: 1 });
        });
  },

    'click #logout': function(){
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }
});

Template.changename.events({
  'click #changebutton': function(e){
    e.preventDefault();
    var name = $('[name=newname]').val();
    if(validName(name)){
      Meteor.call("changeName", name, function(error){
        if(error){
          Bert.alert( 'Unable to change name. Please try again later', 'danger', 'fixed-top' );
          console.log(error);
        }else{
          Bert.alert( 'Successfully changed name.', 'success', 'fixed-top' );
          FlowRouter.go('/account');
        }
      });
    }else{
      Bert.alert( 'Only letters are allowed in a name.', 'danger', 'fixed-top' );
    }
    function validName(str) { return /^[a-zA-Z\s]*$/.test(str); }
  }
});

Template.changeemail.events({
  'click #searchbutton': function(e){
   e.preventDefault();
   var email = $('[name=changeemailform]').val();
   if(validateEmail(email)) {
     Meteor.call('changeEmail', email, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'fixed-top' );
      }else{
        Bert.alert( "Successfully changed email to:"+result+"\r A new verification email has been sent", 'success', 'fixed-top' );
        FlowRouter.go('/account');
      }
     });
    }else{
      Bert.alert( 'Please enter a valid email', 'danger', 'fixed-top' );
    }
      function validateEmail(email) { return /^\w+@(.*)\.[a-zA-Z]{2,4}$/.test(email); }
  }
});

Template.resetpasswordmail.events({
  'click #changebutton': function(e){
    e.preventDefault();
    var token = Session.get('resetPassword');
    var password = $('[name=newpassword]').val();
    var password2 = $('[name=verifynewpassword]').val();
    if (password.length > 0 && password2.length > 0){
      if (password.length >= 6){
        if (password == password2){
          Accounts.resetPassword(token, password, function(err){
            if (err) {
              Bert.alert( 'Unable to reset password. Please try again later.', 'danger', 'fixed-top' );
            }else{
              $('[name=newpassword]').val('');
              $('[name=verifynewpassword]').val('');
              Bert.alert( 'You have successfully reset your password. You will be automatically redirected in 5 seconds.', 'success', 'fixed-top' );
              Meteor.setTimeout(function(){window.location = 'https://ghostwall.io';}, 5000);
            }
          });
        }else{
          Bert.alert("Passwords must be the same", 'danger', 'fixed-top' );
        }
      }else{
        Bert.alert("Password must be at least 6 characters long", 'danger', 'fixed-top' );
      }
    }else{
      Bert.alert("Please complete all fields", 'danger', 'fixed-top' );
    }
  }
});


Template.notfound.events({
  'click #home': function(){
    FlowRouter.go('/ghostwall');
  }
});

Template.verified.onRendered(function(){
  Meteor.setTimeout(function(){window.location = 'https://ghostwall.io';}, 10000);
});

Template.notverified.onRendered(function(){
  Meteor.setTimeout(function(){window.location = 'https://ghostwall.io';}, 10000);
});

var avatarSuccess = function(data){
  var image = "data:image/png;base64," + data;
  var contentType = "image/png";
  var binary = atob(image.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
  var blob = new Blob([new Uint8Array(array)], {type: contentType});
  var upload = new Slingshot.Upload("avatarUpload");
  upload.send(blob, function (error, result) {
          if (error) {
            Bert.alert(error, 'danger', 'fixed-top' );
            Session.set('loading', false);
          }else{
            Meteor.call('insertAvatar', result, function(err){
              if(err){
                Session.set('loading', false);
                Bert.alert(err, 'danger', 'fixed-top');
              }else{
                Session.set('loading', false);
                Bert.alert('Successfully uploaded new avatar image', 'success', 'fixed-top');
              }
          });
        }
      });
};

var avatarFailure = function(error){
  console.log(error);
  Session.set('loading', false);
};

Meteor.Spinner.options = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 4, // The line thickness
    radius: 17, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
};
