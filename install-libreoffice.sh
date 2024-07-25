#!/bin/sh
cat /etc/os-release
# Update yum and install LibreOffice
yum -y update
yum -y install libreoffice
yum --version
libreoffice --version