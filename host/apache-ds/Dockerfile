FROM openjdk:8-alpine

ENV APACHEDS_VERSION 2.0.0.AM25
ENV ADS_HOME /app
ENV ADS_INSTANCE $ADS_HOME/instances/default
ENV ADS_SHUTDOWN_PORT 31999
ENV ADS_CONTROLS ""
ENV ADS_EXTENDED_OPERATIONS ""
ENV ADS_INTERMEDIATE_RESPONSES ""
ENV JAVA_OPTS ""


ADD http://mirror.ventraip.net.au/apache/directory/apacheds/dist/2.0.0.AM25/apacheds-${APACHEDS_VERSION}.zip /tmp/apacheds.zip

RUN mkdir $ADS_HOME

WORKDIR $ADS_HOME

RUN unzip /tmp/apacheds.zip -d $ADS_HOME/ && \
    mv apacheds-${APACHEDS_VERSION}/* $ADS_HOME/ && \
    rmdir apacheds-${APACHEDS_VERSION} && \
    rm -rf /tmp/apacheds.zip  

COPY log4j.properties $ADS_INSTANCE/conf/
COPY config.ldif $ADS_INSTANCE/conf/
COPY run.sh ${ADS_HOME}/bin

RUN chmod +x bin/run.sh 

EXPOSE 10389
EXPOSE 10636

ENTRYPOINT ${ADS_HOME}/bin/run.sh
