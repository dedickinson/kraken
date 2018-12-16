#!/bin/sh
java $JAVA_OPTS $ADS_CONTROLS $ADS_EXTENDED_OPERATIONS $ADS_INTERMEDIATE_RESPONSES \
        -Dlog4j.configuration="file:$ADS_INSTANCE/conf/log4j.properties" \
        -Dapacheds.log.dir="$ADS_INSTANCE/log" \
        -Dapacheds.shutdown.port="$ADS_SHUTDOWN_PORT" \
        -classpath "${ADS_HOME}/lib/apacheds-service-${APACHEDS_VERSION}.jar" \
        org.apache.directory.server.UberjarMain "$ADS_INSTANCE"