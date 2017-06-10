#!/bin/bash
###
# Script to Deploy Meteor App to server
# This has a counterpart on the server, which is called at the end of this script
###
# create by Graham Krizek on March 28, 2016
###
#

echo "Are you deploying to production or staging?"
read ENV

if [ $ENV == "production" ] ; then

	echo ""
	echo "DEPLOYING TO PRODUCTION"
	echo ""
	BRANCH="master"
	SSH="ghost-prod"
  URL="https://app.ghostwall.io"

elif [ $ENV == "staging" ] ; then

	echo ""
	echo "DEPLOYING TO STAGING"
	echo ""
	BRANCH="stage"
	SSH="ghost-stage"
  URL="http://stage.ghostwall.io"

else

	echo "Not a valid environment"
	exit

fi

#echo "Do you want to include an iOS Build? (yes or no)"
#read IOS

#if [ $IOS == 'yes' ] ; then

#  echo "BUILDING FOR IOS"
#  echo ""

#elif [ $IOS == 'no' ] ; then

#  echo "IGNORING IOS BUILD"
#  echo ""

#else

#  echo "Please answer 'yes' or 'no'"
#	exit

#fi

APP_NAME="ghostwall"
ROOT="/Users/AppleUser/Documents/$APP_NAME"
BUILD="/Users/AppleUser/Documents/build-$SSH"

#if [ $IOS == 'yes' ] ; then

#  echo "DELETING OLD FILES"
#  rm -rf $BUILD/*

#else

#  if [ -a $BUILD/$APP_NAME.tar.gz ] ; then

#      echo "DELETING OLD FILES"
#      rm -rf $BUILD/$APP_NAME.tar.gz

#  fi

#fi

rm -rf $BUILD/*

echo "BUILDING THE APP"
cd $ROOT
git checkout $BRANCH

meteor build $BUILD --architecture=os.linux.x86_64 --server $URL

if [ -a $BUILD/$APP_NAME.tar.gz ]
    then
    echo "SENDING THE FILES TO THE SERVER"
	scp $BUILD/$APP_NAME.tar.gz $SSH:/home/gkrizek
else
        echo "$APP_NAME.tar.gz does not exist. Make sure the build was successful."
	exit
fi

ssh $SSH "/home/gkrizek/deploy-ghostwall-server.sh"
