Amazon Web Services SDK for Meteor
=====================

[AWS SDK](https://aws.amazon.com/javascript/) for [Meteor](http://www.meteor.com/) 1.4 and above. Provides an *up to date* SDK for both [client](https://aws.amazon.com/sdk-for-browser/) and [server](https://aws.amazon.com/sdk-for-node-js/)

Follow the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html) on how to use it for both client and server.

Minified AWS-SDK for the browser is included in the package manually to reduce unnecessary size from a submodule. 

Installation
------------

```
meteor add gkrizek:aws
```

Credentials
-----------
**Client**

You should never store any type of credentials in version control. You should leverage Meteor's [settings.json](https://docs.meteor.com/api/core.html#Meteor-settings) file and make sure it's not versioned.

*Example:*

settings.json:
```
{
  "awsAccessKeyId": "<AWS_ACCESS_KEY>",
  "awsSecretKey": "<AWS_SECRET_KEY>"
}
```
Using them in client code:
```
AWS.config.update({
	accessKeyId: Meteor.settings.awsAccessKeyId, 
	secretAccessKey: Meteor.settings.awsSecretKey
});
```

**Server**

On your server, you should either set your AWS credentials as environment variables or in the AWS credentials file.

The credentials file should be located in your application owner's home diretory, under the `.aws` folder. (`~/.aws/credentials`)

~/.aws/credentials
```
[default]
aws_access_key_id = <AWS_ACCESS_KEY>
aws_secret_access_key = <AWS_SECRET_KEY>
```

*Using a server role*

~/.aws/credentials
```
[profile <PROFILE_NAME>]
role_arn = arn:aws:iam::<ACCOUNT_NUMBER>:role/<ROLE_NAME>
source_profile = default
```


