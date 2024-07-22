#!/bin/sh
cat /etc/os-release
# apt-get install -y libreoffice
# Update yum and install LibreOffice
yum -y update
yum -y install libreoffice
# Export the path for LibreOffice binaries
export PATH=$PATH:/usr/bin/libreoffice
# # Verify installation
# libreoffice --version
# yum install -y wget-1.14 tar-1.26 gzip-1.5 cairo-1.15.12 cups-1.6.3 libXinerama.x86_64-1.1.3 cups-libs-1.6.3 dbus-glib-0.100
# cd /usr/local
# wget https://download.documentfoundation.org/libreoffice/stable/7.6.6/rpm/x86_64/LibreOffice_7.6.6_Linux_x86-64_rpm.tar.gz
# echo "Current directory contents before extraction:"
# ls -l
# tar -xvf LibreOffice_7.6.6_Linux_x86-64_rpm.tar.gz
# echo "LibreOffice directory contents after extraction:"
# ls -l libreoffice
# cd LibreOffice_7.6.6.3_Linux_x86-64_rpm/RPMS/
# yum localinstall -y *.rpm --skip-broken
# Update path by updating ~/.bashrc
# export PATH="$PATH:/opt/libreoffice5.0/program"
# # Create a directory for LibreOffice
# mkdir -p libreoffice
# # Download LibreOffice
# wget https://download.documentfoundation.org/libreoffice/stable/7.6.6/rpm/x86_64/LibreOffice_7.6.6_Linux_x86-64_rpm.tar.gz
# echo "Current directory contents before extraction:"
# ls -l
# # Extract the downloaded tarball
# tar libreoffice.tar.gz -C libreoffice --strip-components=1
# echo "LibreOffice directory contents after extraction:"
# ls -l libreoffice
# # Extract the downloaded tarball
# # tar -xzf libreoffice.tar.gz -C libreoffice --strip-components=1
# # Install LibreOffice
# yum -y localinstall libreoffice/RPMS/*.rpm
# # Move the LibreOffice binaries to /usr/local/bin
# mv libreoffice/program/* /usr/local/bin/
# # Update the PATH environment variable to include the LibreOffice binaries
# export PATH=$PWD/libreoffice/program:$PATH
# # Clean up
# rm -rf libreoffice.tar.gz