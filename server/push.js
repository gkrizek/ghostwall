Push.debug = true;

Push.Configure({
  apn: {
    certData: Assets.getText('prod/CertProd.pem'),
    keyData: Assets.getText('prod/KeyProd.pem'),
    passphrase: 'password',
    production: true,
    gateway: 'gateway.push.apple.com'
  },
  gcm: {
    apiKey: 'xxxxxxx'
  },
  production: true,
  sound: true,
  badge: true,
  alert: true,
  vibrate: true,
  sendInterval: 1000
});

Push.allow({
    send: function(userId, notification) {
        return false; // no users are allowed to send. must be done from the server
    }
});
