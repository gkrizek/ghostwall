function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

Template.ghostwall.onRendered(function() {

 Tracker.autorun(function (){
      Geolocation.currentLocation()
	    var location = Geolocation.latLng();
      if (!location){
        Session.set('locationSearch', true);
      }
      var limit = Session.get('itemLimit');
      var maxDist = Session.get('maxDist');
      var sortType = Session.get('sort');
      check(limit, Number);
      check(maxDist, Number);
      check(sortType, String);
      if (location){
        Meteor.subscribe("photosBySort", location, limit, maxDist, sortType, function(){
        Session.set('locationSearch', false);
      });
      }else{
        Session.set('locationSearch', true);
      }
  });
        Meteor.setTimeout(function(){
          Geolocation.currentLocation()
          var location = Geolocation.latLng();
          if (location == null){
           alert('Can\'t get location. Make sure Ghostwall has access to your location in Settings > Privacy > Location Services.');
        }
      }, 15000);

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

Template.ghostwall.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

  'click #findmoredistance': function(){
    Session.set('locationSearch', true);
    FlowRouter.reload();
    Session.set("maxDist", Session.get("maxDist")+50);
    Session.set('itemLimit', 20);
  },

  'click #findlessdistance': function(){
    if (Session.get("maxDist") <= 50){
      console.log('50 miles is the minimum');
    }else{
      Session.set('locationSearch', true);
      FlowRouter.reload();
      Session.set("maxDist", Session.get("maxDist")-50);
      Session.set('itemLimit', 20);
    }
  },

	'click #ghostDiv, click #ghostTitle': function(){
    StatusBar.hide();
		var id = this._id;
    var type = this.type;
		var css = '#ghost-'+id;
		$(css).css('visibility', 'visible');
    if (type == 'video'){
      var videocss = '#ghostvideo-'+id;
      var video = document.querySelector(videocss);
      makeVideoPlayableInline(video);
        video.play();
    }
    Meteor.call('viewed', id);
	},


	'click #top': function(){
		Session.set('sort', 'points');
	},

	'click #new': function(){
		Session.set('sort', 'createdAt');
	},

	'click .ghost-image': function(){
    StatusBar.show();
		var id = '#ghost-'+this._id;
    var type = this.type;
		$(id).css('visibility', 'hidden');
    if (type == 'video'){
      var videocss = '#ghostvideo-'+this._id;
      var video = document.querySelector(videocss);
      video.pause();
    }	},

	'click #ghostUpvote': function(){
		var id = this._id;
		var owner = this.owner;
		Meteor.call('upvote', id, owner, function(error){
			if(error){
				console.log(error);
			}
		});
	},

	'click #ghostDownvote': function(){
		var id = this._id;
		var owner = this.owner;
		Meteor.call('downvote', id, owner, function(error){
			if(error){
				console.log(error);
			}
		});
	},

	'click #message': function(){
  	var owner = this.username;
    var user = Meteor.user().username
    if (owner === user){
      Bert.alert('You can\'t message yourself.', 'danger', 'fixed-top');
    }else{
		  FlowRouter.go('/messages/'+owner);
    }
	},

	'click #username': function(){
		var owner = this.owner;
		FlowRouter.go('/profile/'+owner);
	},

    'click #logout': function(){
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  },

  'click #noghostupdate': function(){
    location.reload();
  }

});

Template.ghostwall.helpers({
	'moreResults': function() {
    	return !(Photos.find().count() < Session.get("itemLimit"));
	},

     'photo': function(){
      Session.setDefault("sort", "points");
      var type = Session.get("sort");
      if (type == "points"){
           var ghosts = Photos.find({}, {sort: {points:-1}}).fetch();
      }else{
           var ghosts = Photos.find({}, {sort: {createdAt:-1}}).fetch();
      }
  	  return ghosts;
 	 },

   'toggle': function(){
    var sort = Session.get('sort');
    if (sort == "points"){
      return true
    }
   },

   'checkPhoto': function(type){
      if (type == 'photo'){
        return true;
      } else {
        return false;
      }
   },

   'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   },

   'isLoading': function(state){
      var loading = Session.get('locationSearch');
      return loading == state;
    },

    'moreGhosts': function(){
      var ghosts = Photos.find({}).count();
      if (ghosts > 0){
        return true;
      }else{
        return false;
      }
    },

    'currDist': function(){
      return Session.get('maxDist');
    }
});

Template.ghostchat.onRendered(function() {

  Session.set('locationSearch', true);

  Tracker.autorun(function (){
      Geolocation.currentLocation()
      var location = Geolocation.latLng();
      if (!location){
        Session.set('locationSearch', true);
      }
      var limit = Session.get('chatItemLimit');
      var maxDist = Session.get('chatMaxDist');
      check(limit, Number);
      check(maxDist, Number);
      if (location){
         Meteor.subscribe("chat", location, limit, maxDist, function(){
          Session.set('locationSearch', false);
         });
      }else{
        Session.set('locationSearch', true);
      }
  });

      Meteor.setTimeout(function(){
          Geolocation.currentLocation()
          var location = Geolocation.latLng();
          if (location == null){
           alert('Can\'t get location. Make sure Ghostwall has access to your location in Settings > Privacy > Location Services.');
        }
      }, 15000);

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

Template.ghostchat.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

	'click #sendbutton': function(){
   		   var message = $('[id=newtext]').val();
		     var location = Geolocation.latLng();
   	  	 var latitude = location.lat;
      	 var longitude = location.lng;
    	if(message.length > 0){
      Meteor.call('insertChatMessage', message, latitude, longitude, function(error){
      if(error){
        console.log(error);
        Bert.alert("There was a problem sending this message. Please try again later.", 'danger', 'fixed-top' );
      }else{
        $('[id=newtext]').val('');
      }
    });
    }else{
      Bert.alert('Messages can\'t be empty', 'danger', 'fixed-top');
    }
  },

  'click #chat-loadmore': function(){
    Session.set('chatItemLimit', Session.get('chatItemLimit')+25);
  },

  'click #findmoredistance': function(){
    FlowRouter.reload();
    Session.set('locationSearch', true);
    Session.set('chatItemLimit', 50);
    Session.set('chatMaxDist', Session.get('chatMaxDist')+50);
  },

  'click #findlessdistance': function(){
    if (Session.get("chatMaxDist") <= 50){
      console.log('50 miles is the minimum');
    }else{
      Session.set('locationSearch', true);
      FlowRouter.reload();
      Session.set("chatMaxDist", Session.get("chatMaxDist")-50);
      Session.set('chatItemLimit', 20);
    }
  },

    'click #logout': function(){
      Session.set('isLoggedIn', false);
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  }
});

Template.ghostchat.helpers({
	'moreResults': function() {
    	return !(Chat.find().count() < Session.get("chatItemLimit"));
	},

     'messages': function(){
      	var ghosts = Chat.find({}, {sort: {'createdAt': -1}}).fetch();
  	  	return ghosts;
 	 },

  isMe: function (sender) {
    var me = Meteor.user().username;
    return sender == me;
  },
  'isLoading': function(state){
      var loading = Session.get('locationSearch');
      return loading == state;
    },

   'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   },

  'moreChats': function(){
      var chats = Chat.find({}).count();
      if (chats > 0){
        return true;
      }else{
        return false;
      }
    },

   'currDist': function(){
      return Session.get('chatMaxDist');
    }
});

Template.myghosts.onRendered(function() {
      Meteor.subscribe("myghosts");

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

Template.myghosts.helpers({

'photo': function(){
      Session.setDefault("sort-myghosts", "points");
      var user = Meteor.userId();
      var type = Session.get("sort-myghosts");
      if (type == "points"){
           var ghosts = Photos.find({owner: user}, {sort: {points:-1}}).fetch();
      }else{
           var ghosts = Photos.find({owner: user}, {sort: {createdAt:-1}}).fetch();
      }
      return ghosts;
  },

    'toggle': function(){
      var sort = Session.get('sort-myghosts');
      if (sort == "points"){
       return true
      }
    },

   'newMessage': function(state){
      var value = Session.get('newMessage');
      return value == state;
   },

      'checkPhoto': function(type){
      if (type == 'photo'){
        return true;
      } else {
        return false;
      }
   }
});

Template.myghosts.events({

  'click #c-button--push-left': function(){
    $('#c-menu--push-left').addClass('is-active');
    $('#site-wrap').addClass("has-push-left");
    $('#top-wrap').addClass("has-push-left");
    $('#c-mask').addClass("is-active");
  },

'click #ghostMessage': function() {
  var conf = confirm("Are you sure you want to delete this ghost?");
  if(conf == true){
  Session.set('loading', true);
  Meteor.call('deleteGhost', this._id, function(error, result){
  	if(error){
  		Bert.alert(error, 'danger', 'fixed-top');
      Session.set('loading', false);
  	}else{
  		if(result == true){
        Session.set('loading', false);
  			Bert.alert('Successfully deleted ghost.', 'success', 'fixed-top');
  		}else{
        Session.set('loading', false);
  			Bert.alert('There was a problem deleting this ghost.', 'danger', 'fixed-top');
  		}
  	}
  });
}
},

  'click #ghostDiv, click #ghostTitleMy': function(){
    StatusBar.hide();
    var id = this._id;
    var type = this.type;
    var css = '#ghost-'+id;
    $(css).css('visibility', 'visible');
    if (type == 'video'){
      var videocss = '#ghostvideo-'+id;
      var video = document.querySelector(videocss);
      makeVideoPlayableInline(video);
      video.play();
    }
  },

    'click .ghost-image': function(){
    StatusBar.show();
    var id = '#ghost-'+this._id;
    var type = this.type;
    $(id).css('visibility', 'hidden');
    if (type == 'video'){
      var videocss = '#ghostvideo-'+this._id;
      var video = document.querySelector(videocss);
      video.pause();
    } },

    'click #logout': function(){
      Meteor.logout();
      Meteor.setTimeout(function(){FlowRouter.go('/');}, 250);
  },

  'click #top': function(){
    Session.set('sort-myghosts', 'points');
  },

  'click #new': function(){
    Session.set('sort-myghosts', 'createdAt');
  },
});


function showMoreVisible() {
    var threshold, target = $("#showMoreResults");
    if (!target.length) return;

    threshold = $(window).scrollTop() + $(window).height() - target.height();

    if (target.offset().top <= threshold) {
        if (!target.data("visible")) {
            target.data("visible", true);
            Session.set("itemLimit",
                Session.get("itemLimit") + 10);
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }
}
$(window).scroll(showMoreVisible);

function scrollToBottom(){
  sleep(100).then(() => {
    $(".bottomofpage")
    .velocity("scroll", {duration: 300})
    .velocity({ opacity: 1 });
  });
}
