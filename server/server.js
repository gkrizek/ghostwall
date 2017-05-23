import { Meteor } from 'meteor/meteor';
Future = Npm.require('fibers/future');

Photos = new Mongo.Collection("photos");
Messages = new Mongo.Collection("messages");
Rooms = new Mongo.Collection("rooms");
Chat = new Mongo.Collection("chat");
Old = new Mongo.Collection("old");

Meteor.startup(() => {
  //export as environmnet variables
  process.env.MAIL_URL = 'MAILURL';
  __meteor_runtime_config__.ROOT_URL = "https://app.ghostwall.io";
});

Photos.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Messages.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Rooms.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Chat.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Old.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Photos.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Messages.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Rooms.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Chat.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Old.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
});

Photos._ensureIndex({'loc.coordinates':'2dsphere'});
Chat._ensureIndex({'loc.coordinates':'2dsphere'});
Photos._ensureIndex({createdAt: 1 }, {expireAfterSeconds: 86400});
Chat._ensureIndex({createdAt: 1 }, {expireAfterSeconds: 86400});
Messages._ensureIndex({createdAt: 1 }, {expireAfterSeconds: 86400});
Messages._ensureIndex({room: 1 });

Meteor.publish("userDoc", function(){
    var userId = this.userId;
    return Meteor.users.find({_id: userId}, {fields: {'name': 1, 'avatar': 1}});
});

Meteor.publish("userProfile", function (user) {
    var user = user;
    return Meteor.users.find({username: user}, {fields: {'name': 1, 'username': 1, 'points': 1, 'createdAt': 1, 'avatar': 1}});
});

Meteor.methods({

  sendVerificationLink() {
    let userId = Meteor.userId();
    if ( userId ) {
      return Accounts.sendVerificationEmail( userId );
    }
  },

  recoverEmail(email){
    var email = email;
    check(email, String);
    var find = Accounts.findUserByEmail(email);
    if (find == null){
      console.log("Can't find the email: "+email);
    }else{
      var verified = find.emails[0].verified;
      if (verified == true){
        var id = find._id;
        Accounts.sendResetPasswordEmail(id);
      }else{
        console.log("Email "+email+" is unverified");
      }
    }
  },

  'reportEmail': function (text) {
    this.unblock();
    check(text, String);
    Email.send({
      to: 'support@ghostwall.io',
      from: 'support@ghostwall.io',
      subject: 'Abuse Report for Ghostwall',
      text: text
    });
  },

  'supportEmail': function (text) {
    this.unblock();
    check(text, String);
    Email.send({
      to: 'support@ghostwall.io',
      from: 'support@ghostwall.io',
      subject: 'Support Request for Ghostwall',
      text: text
    });
  },

  'changeEmail': function(email) {
      var email = email;
      check(email, String);
      var user = Meteor.user();
      if(user.emails && user.emails.length > 0){
        Accounts.removeEmail(user._id, user.emails[0].address)
      }
      Accounts.addEmail(user._id, email);
      Accounts.sendVerificationEmail(user._id);
      return email;
   },

 'findUser': function(username) {
    var user = username;
    check(user, String);
    var id = Meteor.users.findOne({username: user}, {fields: {username: 1}});
    if (id == null){
      throw new Meteor.Error( 500, 'Couldn\'t find user' );
    }else{
      return true;
    }
  },

'changeName': function(name){
  var name = name;
  check(name, String);
  var user = Meteor.userId();
  Meteor.users.update({_id: user}, {$set: {'name': name}});
  return name;
},

'resendVerification': function(){
  var user = Meteor.user();
  if(user.emails[0].address){
    Accounts.sendVerificationEmail(user._id);
    return true;
  }else{
    return false;
  }
},

'myGhosts': function() {
  var user = Meteor.userId();
  return Photos.find({owner: user});
},

  'deleteAccount': function(){
    var userId = Meteor.userId();
    var username = Meteor.users.findOne({_id: userId}, {fields: {'username': 1}});
    Chat.remove({sender: username.username});
    Messages.remove({sender: username.username});
    Messages.remove({recipient: username.username});
    Photos.remove({owner: userId});
    Rooms.remove({'participants.user': username.username});
    Meteor.users.remove(userId);
  }

});

Accounts.onCreateUser(function(options, user) {
   user.points = options.points;
   user.name = options.name;
   user.avatar = options.avatar;
   user.contacts = options.contacts;
   user.rooms = options.rooms;
   user.aws = options.aws;
   return user;
});


Accounts.emailTemplates.siteName = "Ghostwall";
Accounts.emailTemplates.from     = "Ghostwall <support@ghostwall.io>";
Accounts.emailTemplates.verifyEmail.subject = function () {
    return "Ghostwall Email Verification";
};
Accounts.emailTemplates.verifyEmail.html = function(user, url) {
  console.log(url);
    urlNoHash = url.replace('https://app.ghostwall.io/#', 'https://app.ghostwall.io');
    console.log(urlNoHash);
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>Verify Email</title> <style type="text/css"> @import \'https://fonts.googleapis.com/css?family=Dosis\'; html, body{margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important;}*{-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}div[style*="margin: 16px 0"]{margin:0 !important;}table, td{mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}table{border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; Margin: 0 auto !important;}table table table{table-layout: auto;}img{-ms-interpolation-mode:bicubic;}.mobile-link--footer a, a[x-apple-data-detectors]{color:inherit !important; text-decoration: underline !important;}</style> <style>.button-td, .button-a{transition: all 100ms ease-in;}.button-td:hover, .button-a:hover{background: #555555 !important; border-color: #555555 !important;}@media screen and (max-width: 600px){.email-container{width: 100% !important; margin: auto !important;}.fluid, .fluid-centered{max-width: 100% !important; height: auto !important; Margin-left: auto !important; Margin-right: auto !important;}.fluid-centered{Margin-left: auto !important; Margin-right: auto !important;}.stack-column, .stack-column-center{display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important;}/* And center justify these ones. */ .stack-column-center{text-align: center !important;}.center-on-narrow{text-align: center !important; display: block !important; Margin-left: auto !important; Margin-right: auto !important; float: none !important;}table.center-on-narrow{display: inline-block !important;}}</style></head><body bgcolor="#cccccc" width="100%" style="Margin: 0;"> <center style="width: 100%; background: #cccccc;"> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: Dosis, Arial, sans-serif;"> Thank you for registering to Ghostwall! </div><table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container"><tr><td style="padding: 20px 0; text-align: center"></td></tr></table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="600" style="margin: auto;" class="email-container"> <tr><td align="center"><img src="https://s3.us-east-2.amazonaws.com/static.ghostwall.io/ghosty-purple-350-150.svg" width="350" height="150" alt="Ghostwall" border="0" align="center" style="width: 100%; max-width: 350px; padding-top: 20px"></td></tr><tr> <td style="padding: 40px; text-align: center; font-family: Dosis, Arial, sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <h2>Thank you for registering to Ghostwall!</h2><br/>Please verify your email address by clicking the Verify button below. <br><br><table cellspacing="0" cellpadding="0" border="0" align="center" style="Margin: auto"> <tr> <td style="border-radius: 3px; background: #6d2c91; text-align: center;" class="button-td"> <a href="'+urlNoHash+'" style="background: #6d2c91; border: 15px solid #6d2c91; font-family: Dosis, Arial, sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a"> &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ffffff">Verify</span>&nbsp;&nbsp;&nbsp;&nbsp; </a> </td></tr></table> </td></tr><tr> <td style="padding: 15px; text-align: center; font-family: Dosis, Arial, sans-serif; font-size: 12px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> If the button doesn\'t work for you, please copy and paste this url into a browser:<br/> <a href="'+urlNoHash+'">'+urlNoHash+'</a> </td></tr><table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container"> <tr> <td style="padding: 20px 10px;width: 100%;font-size: 12px; font-family: Dosis, Arial, sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;"> <webversion><a href="https://ghostwall.io" style="color: #333333; text-decoration: none;">https://ghostwall.io</a></webversion> </td></tr></table> </center></body></html>';
};
Accounts.emailTemplates.resetPassword.subject = function () {
    return "Ghostwall Password Reset";
};
Accounts.emailTemplates.resetPassword.html = function(user, url) {
    urlNoHash = url.replace('https://app.ghostwall.io/#', 'https://app.ghostwall.io');
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>Reset Password</title><!--[if mso]> <style>*{font-family: Dosis, Arial, sans-serif !important;}</style><![endif]--> <style type="text/css"> @import \'https://fonts.googleapis.com/css?family=Dosis\'; html, body{margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important;}*{-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}div[style*="margin: 16px 0"]{margin:0 !important;}table, td{mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}table{border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; Margin: 0 auto !important;}table table table{table-layout: auto;}img{-ms-interpolation-mode:bicubic;}.mobile-link--footer a, a[x-apple-data-detectors]{color:inherit !important; text-decoration: underline !important;}</style> <style>.button-td, .button-a{transition: all 100ms ease-in;}.button-td:hover, .button-a:hover{background: #555555 !important; border-color: #555555 !important;}/* Media Queries */ @media screen and (max-width: 600px){.email-container{width: 100% !important; margin: auto !important;}.fluid, .fluid-centered{max-width: 100% !important; height: auto !important; Margin-left: auto !important; Margin-right: auto !important;}.fluid-centered{Margin-left: auto !important; Margin-right: auto !important;}.stack-column, .stack-column-center{display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important;}.stack-column-center{text-align: center !important;}.center-on-narrow{text-align: center !important; display: block !important; Margin-left: auto !important; Margin-right: auto !important; float: none !important;}table.center-on-narrow{display: inline-block !important;}}</style></head><body bgcolor="#cccccc" width="100%" style="Margin: 0;"> <center style="width: 100%; background: #cccccc;"> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: Dosis, Arial, sans-serif;"> You requested a password reset from Ghostwall. </div><table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container"><tr><td style="padding: 20px 0; text-align: center"></td></tr></table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="600" style="margin: auto;" class="email-container"> <tr><td align="center"><img src="https://s3.us-east-2.amazonaws.com/static.ghostwall.io/ghosty-purple-350-150.svg" width="350" height="150" alt="Ghostwall" border="0" align="center" style="width: 100%; max-width: 350px; padding-top: 20px;"></td></tr><tr> <td style="padding: 40px; text-align: center; font-family: Dosis, Arial, sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <h2>You requested a password reset from Ghostwall.</h2><br/>Click the button below to reset your password. If you didn\'t request this reset, please contact Ghostwall support immediately. <br><br><table cellspacing="0" cellpadding="0" border="0" align="center" style="Margin: auto"> <tr> <td style="border-radius: 3px; background: #6d2c91; text-align: center;" class="button-td"> <a href="'+urlNoHash+'" style="background: #6d2c91; border: 15px solid #6d2c91; font-family: Dosis, Arial, sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a"> &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ffffff">Reset Password</span>&nbsp;&nbsp;&nbsp;&nbsp; </a> </td></tr></table> </td></tr><tr> <td style="padding: 15px; text-align: center; font-family: Dosis, Arial, sans-serif; font-size: 12px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> If the button doesn\'t work for you, please copy and paste this url into a browser:<br/> <a href="'+urlNoHash+'">'+urlNoHash+'</a> </td></tr><table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin: auto;" class="email-container"> <tr> <td style="padding: 20px 10px;width: 100%;font-size: 12px; font-family: Dosis, Arial, sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;"> <webversion><a href="https://ghostwall.io" style="color: #333333; text-decoration: none;">https://ghostwall.io</a></webversion> </td></tr></table> </center></body></html>';
};
