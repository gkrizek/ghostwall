#!/bin/bash
###
# Script to Deploy Meteor App to server
# This has a counterpart on the client, which is what calls this script to run
###
# create by Graham Krizek on March 28, 2016
###
#
APP_NAME="ghostwall"
ROOT="/var/www/$APP_NAME"
HOME="/home/gkrizek"

sudo /etc/init.d/ghostwall stop
sudo rm -rf $ROOT/*

if [ -e "$HOME/$APP_NAME.tar.gz" ]
    then
	echo "MOVING TO WEBROOT"
	mv $HOME/$APP_NAME.tar.gz $ROOT
else
        echo "$HOME/$APP_NAME.tar.gz does not exist. Make sure the tarball made it to the server ok."
	exit
fi

sudo tar -zxvf $ROOT/$APP_NAME.tar.gz
cd $ROOT/bundle/program/server && sudo npm install

sudo chown -R nginx:nginx $ROOT

echo "START SERVICE"
sudo /etc/init.d/ghostwall start

echo " "
echo "SUCCESSFULLY DEPLOYED TO PRODUCTION"
