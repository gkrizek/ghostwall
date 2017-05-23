Meteor.publish("photosBySort", function (location, limit, maxDist, sortType) {
	var dist = maxDist/3963.2;
	if (sortType == 'points'){
	return Photos.find({loc: {$geoWithin: {$centerSphere: [[location.lng, location.lat], dist]}}}, {sort: {'points': -1}, limit: limit}, {fields: {'_id': 1, 'createdAt': 1, 'owner': 1, 'username': 1, 'title': 1, 'filename': 1, 'points': 1, 'type': 1}, 'loc': 0});
	}else{
	return Photos.find({loc: {$geoWithin: {$centerSphere: [[location.lng, location.lat], dist]}}}, {sort: {'createdAt': -1}, limit: limit}, {fields: {'_id': 1, 'createdAt': 1, 'owner': 1, 'username': 1, 'title': 1, 'filename': 1, 'points': 1, 'type': 1, 'loc': 0}});
	}

});

Meteor.publish("chat", function (location, limit, maxDist) {
	var dist = maxDist/3963.2;
    return Chat.find({loc: {$geoWithin:{$centerSphere: [[location.lng, location.lat], dist]}}}, {sort: {'createdAt': -1}, limit: limit}, {fields: {'_id': 1, 'sender': 1, 'message': 1, 'createdAt': 1, 'loc': 0}});
});

Meteor.publish("myghosts", function () {
	var user = this.userId;
    return Photos.find({owner: user}, {fields: {'_id': 1, 'createdAt': 1, 'owner': 1, 'username': 1, 'title': 1, 'filename': 1, 'points': 1, 'views': 1, 'type': 1}});
});

Meteor.methods({

	'checkViewed': function(id){
		var id = id;
		check(id, String);
		var photo = Photos.findOne(id);
		var user = Meteor.userId();
		if (_.include(photo.viewers, user)){
			return true
		}else{
			return false;
		}
	},

	'viewed': function(id) {
		var id = id;
		check(id, String);
		var user = Meteor.userId();
		Photos.update(id, {$addToSet: {viewers: user}});
		Photos.update(id, {$inc: {views: 1}});
	},

	'upvote': function(id, owner){
		var id = id;
		check(id, String);
		var owner = owner;
		check(owner, String);
		var user = Meteor.userId();
		var photo = Photos.findOne(id);
		if (!_.include(photo.upvoters, user)){
			if(_.include(photo.downvoters, user)){
				Photos.update(id, {$pull: {downvoters: user}, $inc: {points: 1}});
				Meteor.users.update(owner, {$inc: {points: 1}});
			}else{
				Photos.update(id, {$addToSet: {upvoters: user}, $inc: {points: 1}});
				Meteor.users.update(owner, {$inc: {points: 1}});
			}
		}
	},

	'downvote': function(id, owner){
		var id = id;
		check(id, String);
		var owner = owner;
		check(owner, String);
		var user = Meteor.userId();
		var photo = Photos.findOne(id);
		if (!_.include(photo.downvoters, user)){
			if(_.include(photo.upvoters, user)){
				Photos.update(id, {$pull: {upvoters: user}, $inc: {points: -1}});
				Meteor.users.update(owner, {$inc: {points: -1}});
			}else{
				Photos.update(id, {$addToSet: {downvoters: user}, $inc: {points: -1}});
				Meteor.users.update(owner, {$inc: {points: -1}});
			}
		}
	},

	'insertChatMessage': function(message, lat, lng){
		 var message = message;
		 check(message, String);
		 var lat = lat;
		 check(lat, Number);
		 var lng = lng;
		 check(lng, Number);
		 var sender = Meteor.user().username;
		 var ipAddr = "0.0.0.0";
		 Chat.insert({sender: sender, message: message, clientIp: ipAddr, loc: {type: "Point", coordinates: [lng, lat]}});
		 return true;
	},

	'deleteGhost': function(id){
	 	var id = id;
	 	check(id, String);
	 	var user = Meteor.userId();
	 	var test = Photos.find({id: id, owner: user});
	 	if(test){
	   	 Photos.remove(id);
	   	 return true;
	   	}else{
	   	 return false;
	   	}
  	}
});
