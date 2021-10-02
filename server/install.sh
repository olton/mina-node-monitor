#!/bin/bash

YELLOW="\033[33m"
GREEN="\033[32m"

echo "---------------"
echo -e "$GREEN Welcome to Mina Monitor Server installer!\033[0m"
echo "---------------"

if [ -n "$1" ]
then
VER=$1
else
VER="master"
fi

if [ -n "$2" ]
then
TARGET=$2
else
TARGET="mina-monitor-${VER}"
fi

echo "---------------"
echo -e "$GREEN We are installing to Mina Monitor Server ${VER} branch\033[0m"
echo -e "$GREEN into a ~/${TARGET} folder\033[0m"
echo "---------------"


echo "---------------"
echo -e "$YELLOW Installing Mina Monitor Server...\033[0m"
echo "---------------"

cd ~
mkdir -p ${TARGET}
cd ${TARGET}
curl -L https://github.com/olton/mina-node-monitor/tarball/${VER} >> _.tar.gz
url=$(tar -tf _.tar.gz | head -n 1) | tar --strip-components=2 -xf _.tar.gz ${url}server

echo "---------------"
echo -e "$YELLOW Deleting temporary files...\033[0m"
echo "---------------"

rm _.tar.gz

echo "---------------"
echo -e "$YELLOW Creating config file...\033[0m"
echo "---------------"

node index --init

echo "---------------"
echo -e "$GREEN Mina Monitor Server successfully installed...\033[0m"
echo "---------------"

