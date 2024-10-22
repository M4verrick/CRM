package com.itsag3t1.crm.logger;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatchlogs.CloudWatchLogsClient;
import software.amazon.awssdk.services.cloudwatchlogs.model.DescribeLogStreamsRequest;
import software.amazon.awssdk.services.cloudwatchlogs.model.DescribeLogStreamsResponse;
import software.amazon.awssdk.services.cloudwatchlogs.model.InputLogEvent;
import software.amazon.awssdk.services.cloudwatchlogs.model.PutLogEventsRequest;

import java.net.URI;
import java.util.LinkedList;
import java.util.Queue;

public class CloudWatchAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {
    private final CloudWatchLogsClient client;
    private final String logGroupName;
    private final String logStreamName;
    private final ObjectMapper objectMapper;

    private final Queue<InputLogEvent> eventQueue;

    public CloudWatchAppender() {
        logGroupName = "crm-logs";
        logStreamName = "crm-log-stream";

        client = CloudWatchLogsClient.builder()
               .endpointOverride(URI.create("http://localhost:4566"))
                .region(Region.AP_SOUTHEAST_1)
                .build();
        eventQueue = new LinkedList<>();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    protected void append(ILoggingEvent event) {
        try {
            // Create JSON object with required fields
            ObjectNode logJson = objectMapper.createObjectNode();
            logJson.put("loggerName", event.getLoggerName());
            logJson.put("logLevel", event.getLevel().toString());
            logJson.put("timestamp", event.getTimeStamp());
            logJson.put("message", event.getFormattedMessage());
            logJson.set("mdc", objectMapper.valueToTree(event.getMDCPropertyMap()));

            // Serialize the JSON object to a string
            String jsonMessage = objectMapper.writeValueAsString(logJson);

            // Construct the log message
            InputLogEvent logEvent = InputLogEvent.builder()
                    .message(jsonMessage)
                    .timestamp(event.getTimeStamp())
                    .build();

            // Add event to the queue
            eventQueue.add(logEvent);

            // Flush queue if it has more than 10 events - Prod
            /*
            if (eventQueue.size() >= 10) {
                flushEvents();
            }
            */
            // Flush queue - Dev
            flushEvents();
        } catch (Exception e) {
            System.out.println("Error occurred while appending log event: " + e.getMessage());
        }
    }

    private void flushEvents() {
        // Retrieve the existing log events
        DescribeLogStreamsResponse describeLogStreamsResponse = client.describeLogStreams(DescribeLogStreamsRequest.builder()
                .logGroupName(logGroupName)
                .logStreamNamePrefix(logStreamName)
                .build());

        // Check if logStreams list is empty
        if (describeLogStreamsResponse.logStreams().isEmpty()) {
            System.out.println("No log streams found.");
            return;
        }

        String sequenceToken = describeLogStreamsResponse.logStreams().get(0).uploadSequenceToken();

        // Batch up the next 10 events
        LinkedList<InputLogEvent> logEventsBatch = new LinkedList<>();
        while (!eventQueue.isEmpty() && logEventsBatch.size() < 10) {
            logEventsBatch.add(eventQueue.poll());
        }

        // Check if logEventsBatch is empty
        if (logEventsBatch.isEmpty()) {
            return; // Skip the API call if there are no log events
        }

        // Put the log events into the CloudWatch stream
        PutLogEventsRequest putLogEventsRequest = PutLogEventsRequest.builder()
                .logGroupName(logGroupName)
                .logStreamName(logStreamName)
                .logEvents(logEventsBatch)
                .sequenceToken(sequenceToken)
                .build();

        client.putLogEvents(putLogEventsRequest);
    }

    @Override
    public void stop() {
        // Flush any remaining events before stopping
        flushEvents();

        // Clean up the AWS CloudWatchLogs client
        client.close();

        super.stop();
    }
}
