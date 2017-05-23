Template.camera.helpers({
    photo: function () {
      return Session.get("photo");
    },

    video: function () {
      if(Blaze._globalHelpers.isAndroid()){
      	var original = Session.get("video");
    	var part = original.replace('file:', ''); 
  	  }else{
    	var part = Session.get("video");
 	  }
 	  console.log(part);
      var url = "http://localhost:12184/local-filesystem" +part
      console.log(url);
      if (part){
      	return WebAppLocalServer.localFileSystemUrl(url);
      }else{
      	return part;
      }
    },

    album: function(){
    	return Session.get('album');
    },

    isLoading: function(state){
    	var loading = Session.get('loading');
    	return loading == state; 
    }
});

Template.camera.onRendered(function(){
	console.log('loaded Camera page');
})

Template.camera.events({
	'click #picture': function(){
		Session.setDefault("photo", null);
		Session.set('loading', true);
		var options = {};
		navigator.camera.getPicture(pictureSuccess, pictureFailure, 
   			 _.extend(options, {
     			 quality: options.quality || 75,
     			 targetWidth: options.width || 440,
     			 targetHeight: options.height || 710,
     			 destinationType: Camera.DestinationType.DATA_URL,
     			 sourceType: Camera.PictureSourceType.CAMERA,
				 encodingType: Camera.EncodingType.PNG
    			})
 		 );
	},

	'click .photosubmit': function(e){
		e.preventDefault();
		var name = $('[id=photoname]').val();
	    var local = Geolocation.latLng();
	    var dataUri = Session.get("photo");
	    var contentType = "image/png";
	    if(name.length > 0){
	    if(name.length < 101){
		if (Meteor.status().connected == false){
       		bert.alert('Can\'t connect to the server. Please check your network settings.', 'danger', 'fixed-top');
     	}else{
	    if(local){
	    	Session.set('loading', true);
	    	var binary = atob(dataUri.split(',')[1]);
	    	var array = [];
	    	for(var i = 0; i < binary.length; i++) {
	        	array.push(binary.charCodeAt(i));
	    	}
	    	var blob = new Blob([new Uint8Array(array)], {type: contentType});
			var upload = new Slingshot.Upload("photoUpload");        
	     	upload.send(blob, function (error, url) {
	             if (error) {
	               Bert.alert(error, 'danger', 'fixed-top');
	             }else{
	             	var fileName = url.substr(url.lastIndexOf('/') + 1);
	                Meteor.call('insertPhoto', name, local, fileName, function(error){
	               		if(error){
	               			Bert.alert(error.reason, 'danger', 'fixed-top');
	               		}else{
	               			Bert.alert("Successfully uploaded photo.", 'success', 'fixed-top');
	                    	StatusBar.show();
	                    	FlowRouter.go("/ghostwall");
	               			Session.set("photo", null);
	               			Session.set('loading', false);
	               		}
	               });
	             }
	        });
		
	    }else{
	    	Bert.alert("Can't get your location. Please make sure Ghostwall has access to GPS in the Settings app.", 'danger', 'fixed-top');
	    }
		}
	   	}else{
	  		Bert.alert('Titles can\'t be longer than 100 characters', 'danger', 'fixed-top');
	  }
	  }else{
	  		Bert.alert('You must provide a title', 'danger', 'fixed-top');
	  }
	},

	'click #video': function(){
		Session.setDefault('video', null);
		Session.set('loading', true);
		console.log('cliceked Video');
		navigator.device.capture.captureVideo(videoSuccess, videoError, {limit:1, duration: 20, quality: 1});
	},

	'click .videosubmit': function(e){
		e.preventDefault();
		var name = $('[name=videoname]').val();
		var local = Geolocation.latLng();
		var session = Session.get('videoName');
		var fileName = session.substr(session.lastIndexOf('/') + 1);
		if(name.length > 0){
		if(name.length < 101){
		if (Meteor.status().connected == false){
       		bert.alert('Can\'t connect to the server. Please check your network settings.', 'danger', 'fixed-top');
     	}else{
		if(local){
		Meteor.call('insertVideo', name, local, fileName, function(error){
			if (error){
				console.log(error);
				//maybe change this error text
				Bert.alert("Can't get your location. Please make sure Ghostwall has access to GPS in Settings.", 'danger', 'fixed-top');
			}else{
				var video = Session.get('mp4Url');
   				var url = 'file://'+video;
   				resolveLocalFileSystemURL(url, function(entry) {
  					entry.remove();
				});
				FlowRouter.go("/ghostwall");
				Bert.alert("Successfully uploaded video.", 'success', 'fixed-top');
				StatusBar.show();
				Session.set('video', null);
			}
		});
		}else{
	    	Bert.alert("Can't get your location. Please make sure Ghostwall has access to GPS in the Settings app.", 'danger', 'fixed-top');
	    }
		}
		}else{
	  		Bert.alert('Titles can\'t be longer than 100 characters', 'danger', 'fixed-top');
	  	}
	   }else{
	   	Bert.alert('You must provide a title', 'danger', 'fixed-top');
	   }
	},

	'click #uploadalbum': function(){
		Session.set('loading', true);
    	var cameraOptions = {
        targetWidth: 1100,
        targetHeight: 1500,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        quality: 75
      };
      navigator.camera.getPicture(albumSuccess, albumFailure, cameraOptions)
 	 },

 	 'click #albumsubmit': function(e){
 	 	e.preventDefault();
 	 	var name = $('[name=albumname]').val();
		var local = Geolocation.latLng();
		var image = Session.get('album');
 	 	var contentType = "image/png";

		if(name.length > 0){
	   	if(name.length < 101){
		if (Meteor.status().connected == false){
       		bert.alert('Can\'t connect to the server. Please check your network settings.', 'danger', 'fixed-top');
     	}else{
	    if(local){
	    	Session.set('loading', true);
	    	var binary = atob(image.split(',')[1]);
        	var array = [];
        	for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
       		}
  			var blob = new Blob([new Uint8Array(array)], {type: contentType});
 			var upload = new Slingshot.Upload("albumUpload");        
 			upload.send(blob, function (error, url) {
          	if (error) {
            	Bert.alert(error, 'danger', 'fixed-top' );
            	Session.set('loading', false);
          	}else{
          		var fileName = url.substr(url.lastIndexOf('/') + 1);
	            Meteor.call('insertPhoto', name, local, fileName, function(error){
	            	if(error){
	           			Bert.alert(error.reason, 'danger', 'fixed-top');
	           			Session.set('loading', false);
	            	}else{
	               		Bert.alert("Successfully uploaded photo.", 'success', 'fixed-top');
	                    StatusBar.show();
	                    FlowRouter.go("/ghostwall");
	               		Session.set("album", null);
	               		Session.set('loading', false);
	               	}
	            });
          	}
      	});
	    }else{
	    	Bert.alert("Can't get your location. Please make sure Ghostwall has access to GPS in the Settings app.", 'danger', 'fixed-top');
	    }
		}
	   	}else{
	  		Bert.alert('Titles can\'t be longer than 100 characters', 'danger', 'fixed-top');
	  	}
	  	}else{
	  		Bert.alert('You must provide a title', 'danger', 'fixed-top');
	 	}
 	 },

	'click .photodelete': function(e){
		e.preventDefault();
		Session.set('photo', null);
		StatusBar.show();
		$('[name=photoname]').val('');
	},

	'click .videodelete': function(e){
		e.preventDefault();
		Session.set('video', null);
		$('[name=videoname]').val('');
		StatusBar.show();
		var video = Session.get('mp4Url');
   		var url = 'file://'+video;
		resolveLocalFileSystemURL(url, function(entry) {
  			entry.remove();
		});
	},

	'click .albumdelete': function(e){
		e.preventDefault();
		Session.set('album', null);
		StatusBar.show();
		$('[name=albumname]').val('');
	}

});

var pictureSuccess = function(data){
	StatusBar.hide();
	Session.set('loading', false);
	var image = "data:image/jpeg;base64," + data;
	Session.set("photo", image);
}

var pictureFailure = function(error){
	Session.set('loading', false);
	console.log(error);
}

var videoError = function(error) {
	Session.set('loading', false);
	console.log(error);
}

var videoSuccess = function(mediaFiles) {
	console.log('successfully got video');
	Session.set('loading', true);
	if(Blaze._globalHelpers.isAndroid()){
    	var imageUri = mediaFiles[0].fullPath;
  	}else{
    	var imageUri = "file://" +mediaFiles[0].fullPath;
 	}
  	console.log(imageUri);
    Session.set("videoURL", mediaFiles[0].fullPath);
    window.resolveLocalFileSystemURL(imageUri, function(fileEntry) {
    	fileEntry.file(function(file) {
       		fileFunction(file);
       		console.log('calling fileFunction');
   		});
	});
}

var fileFunction = function(file){
	var reader = new FileReader();
	reader.onloadend = function(e) {
    var vid = "data:video/quicktime;base64," +window.btoa(e.target.result);
    var fileBlob = dataURItoBlob(vid);
    var upload = new Slingshot.Upload("videoUpload");  
    console.log('got blog now trying for upload');      
    	upload.send(fileBlob, function (error, url) {
      		if (error) {
      			Bert.alert(error, 'danger', 'fixed-top');
      			Session.set('loading', false);
      		}else{
      			Session.set('videoName', url);
      			if(Blaze._globalHelpers.isAndroid()){
    				Session.set("video", Session.get("videoURL"));
  				}else{
    				transcode();
 				}
      		}
    	});
	}
	reader.readAsBinaryString(file);
}

var transcode = function() {
	console.log('called transcode');
 	var file = Session.get("videoURL");
 	console.log(file);
    var videoFileName = Random.id([17]);
    VideoEditor.transcodeVideo(
        videoTranscodeSuccess,
        videoTranscodeError,
        {
            fileUri: file,
            outputFileName: videoFileName,
            outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
            optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
            saveToLibrary: false,
            maintainAspectRatio: true,
            width: 1100,
            height: 1100,
            videoBitrate: 1000000,
            audioChannels: 2,
            audioSampleRate: 44100,
            audioBitrate: 128000,
        }
    );
}

function videoTranscodeSuccess(result) {
	console.log('video videoTranscodeSuccess');
	StatusBar.hide();
    Session.set("video", result);
    Session.set('loading', false);
    FlowRouter.go('/ghostwall');
    FlowRouter.go('/camera');
    var video = document.querySelector('#ghostvideo');
    makeVideoPlayableInline(video, false);
    video.play();
}

function videoTranscodeError(err) {
	console.log(err);
    Bert.alert(err, 'danger', 'fixed-top');
}

var albumSuccess = function(data){
  StatusBar.hide();
  Session.set('loading', false);
  var image = "data:image/png;base64," + data;
  Session.set('album', image);
};

var albumFailure = function(error){
  Session.set('loading', false);
  console.log(error);
};

function dataURItoBlob(dataURI) {
  var contentType = "video/mp4";
  var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    var blob = new Blob([new Uint8Array(array)], {type: contentType});
    return blob;
}