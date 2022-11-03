FROM pext/yotta:latest

RUN apt-get install nodejs
RUN apt-get install npm
RUN apt-get install git
RUN apt-get update && apt-get upgrade

RUN mkdir /cloud-build \
&& cd /cloud-build/ \
&& git clone https://github.com/letssteam/pxt-lets-steam-cloud-build-server.git \
&& npm install \ 
&& npm run start;

