FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('layout', { main: 'webnotfound' });
    }
};

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        FlowRouter.go('/notverified');
      } else {
        FlowRouter.go('/verified')
      }
    });
  }
});

FlowRouter.route('/verified', {
  action: function() {
    BlazeLayout.render('layout', { main: 'verified' });
  }
});

FlowRouter.route('/notverified', {
  action: function() {
    BlazeLayout.render('layout', { main: 'notverified' });
  }
});

FlowRouter.route('/reset-password/:token', {
    action: function(params) {
    BlazeLayout.render('layout', { main: 'resetpasswordmail' });
    Session.set('resetPassword', params.token);
  }
});

if(Meteor.isCordova){

function checkLoggedIn (ctx, redirect) {
  if (!Meteor.userId()) {
    redirect('/')
  }
}

function redirectIfLoggedIn (ctx, redirect) {
  if (Meteor.userId()) {
    redirect('/ghostwall')
  }
}

FlowRouter.route('/', {
  triggersEnter: [redirectIfLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'home' });
  }
});

FlowRouter.route('/register', {
  triggersEnter: [redirectIfLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'register' });
  }
});

FlowRouter.route('/camera', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'camera' });
  }
});

FlowRouter.route('/ghostwall', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'ghostwall' });
  }
});

FlowRouter.route('/people', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'people' });
  }
});


FlowRouter.route('/ghostchat', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'ghostchat' });
  }
});

FlowRouter.route('/contacts', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'contacts' });
  }
});

FlowRouter.route('/messages/:user', {
  triggersEnter: [checkLoggedIn],
  action: function(params) {
    BlazeLayout.render('layout', { main: 'messages' });
      Session.set('user', params.user);
  }
});

FlowRouter.route('/myghosts', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'myghosts' });
  }
});

FlowRouter.route('/profile/:user', {
  triggersEnter: [checkLoggedIn],
  action: function(params) {
    BlazeLayout.render('layout', { main: 'profile' });
    Session.set('profile', params.user);
  }
});

FlowRouter.route('/report', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'report' });
  }
});

FlowRouter.route('/account', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'settings' });
  }
});

FlowRouter.route('/support', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'support' });
  }
});

FlowRouter.route('/resetpasswordapp', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'resetpasswordapp' });
  }
});

FlowRouter.route('/changename', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'changename' });
  }
});


FlowRouter.route('/changeemail', {
  triggersEnter: [checkLoggedIn],
  action: function() {
    BlazeLayout.render('layout', { main: 'changeemail' });
  }
});

FlowRouter.route('/recover', {
  action: function() {
    BlazeLayout.render('layout', { main: 'recover' });
  }
});

FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('layout', { main: 'notfound' });
    }
};
}
