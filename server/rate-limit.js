var insertRule = {
	type: 'method',
	name: 'insertMessage',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(insertRule, 1, 1000);

var ghostchatRule = {
	type: 'method',
	name: 'insertChatMessage',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(ghostchatRule, 5, 1000);

var insertPhotoRule = {
	type: 'method',
	name: 'insertPhoto',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(insertPhotoRule, 1, 1000);

var insertVideoRule = {
	type: 'method',
	name: 'insertVideo',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(insertVideoRule, 1, 1000);

var findUserRule = {
	type: 'method',
	name: 'insertUser',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(findUserRule, 5, 1000);

var supportRule = {
	type: 'method',
	name: 'supportEmail',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(supportRule, 1, 1000);

var reportRule = {
	type: 'method',
	name: 'reportEmail',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(supportRule, 1, 1000);

var changeNameRule = {
	type: 'method',
	name: 'changeName',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(changeNameRule, 5, 1000);

var changeEmailRule = {
	type: 'method',
	name: 'changeEmail',
	userId(userId) {
    	if (userId) {
     	 return true;
   		}
 	}
}

DDPRateLimiter.addRule(changeEmailRule, 5, 1000);

