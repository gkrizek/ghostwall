App.info({
  id: 'com.id.id',
  name: 'Ghostwall',
  description: 'Share disappearing photos, videos, and messages with the people around you.',
  email: 'hello@ghostwall.io',
  website: 'https://app.ghostwall.io'
})
App.accessRule('*');
App.setPreference('StatusBarStyle', 'default');
App.setPreference('StatusBarBackgroundColor', '#000000');
App.setPreference('AllowInlineMediaPlayback', true);
App.setPreference('mediaPlaybackRequiresUserAction', false);
App.setPreference('StatusBarOverlaysWebView', true);
App.setPreference('BackupWebStorage', false);
App.setPreference('SplashScreenDelay', '0');
App.setPreference('FadeSplashScreenDuration', '500');
App.setPreference('ShowSplashScreenSpinner', false);
App.setPreference('android-minSdkVersion', '18');
App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: 12341234
});
App.icons({
  'iphone_2x' : 'icons/iphone_2x.png',
  'iphone_3x' : 'icons/iphone_3x.png',
  'ipad' : 'icons/ipad.png',
  'ipad_pro' : 'icons/ipad_pro.png',
  'ipad_2x' : 'icons/ipad_2x.png',
  'ios_settings' : 'icons/ios_settings.png',
  'ios_settings_2x' : 'icons/ios_settings_2x.png',
  'ios_settings_3x' : 'icons/ios_settings_3x.png',
  'ios_spotlight' : 'icons/ios_spotlight.png',
  'ios_spotlight_2x' : 'icons/ios_spotlight_2x.png',
  'android_mdpi' : 'icons/android_mdpi.png',
  'android_hdpi' : 'icons/android_hdpi.png',
  'android_xhdpi' : 'icons/android_xhdpi.png',
  'android_xxhdpi' : 'icons/android_xxhdpi.png',
  'android_xxxhdpi' : 'icons/android_xxxhdpi.png'
});
App.launchScreens({
  'iphone_2x' : 'splash/iphone_2x.png',
  'iphone5' : 'splash/iphone5.png',
  'iphone6' : 'splash/iphone6.png',
  'iphone6p_portrait' : 'splash/iphone6p_portrait.png',
  'iphone6p_landscape' : 'splash/iphone6p_landscape.png',
  'ipad_portrait' : 'splash/ipad_portrait.png',
  'ipad_portrait_2x' : 'splash/ipad_portrait_2x.png',
  'ipad_landscape' : 'splash/ipad_landscape.png',
  'ipad_landscape_2x' : 'splash/ipad_landscape_2x.png'
});
