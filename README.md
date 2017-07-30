# Ghostwall

### Connect with what's around you

A mobile photo and video sharing application written in Meteor.


#### Summary

This repository is meant to simply show how I created Ghostwall. This is not a tutorial or guide, but more a code dump.

#### Getting Started

For security reasons, I didn't check in any sensitive information into git. So before running you need to remove references to these secrets (or put your own in place of them).

- [Apple Push Notification Certs](https://github.com/gkrizek/ghostwall/blob/master/server/push.js#L5-L6)
- [AWS Keys for Upload](https://github.com/gkrizek/ghostwall/blob/master/server/camera.js) (optional)
- [Email Provider](https://github.com/gkrizek/ghostwall/blob/master/server/server.js#L12) (optional)

After invalid references are removed, you should be able to run this as-is on an iOS device or an iOS simulator.

If you want to run this on the desktop, you must comment out the `isCordova` check on routes. [See Here](https://github.com/gkrizek/ghostwall/blob/master/client/routes.js#L39) [and Here](https://github.com/gkrizek/ghostwall/blob/master/client/routes.js#L180)
