import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import React from 'react';
import { CloudWatchLogsClient, FilterLogEventsCommand, DescribeLogStreamsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

const client = new CloudWatchLogsClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  }
});

const LOG_GROUP_NAME = "/aws/eks/itsag3t1-crm/aws-fluentbit-logs-20241103110112589200000009/workload/itsag3t1-crm";

async function getRecentBackendLogStreams() {
  try {
    const command = new DescribeLogStreamsCommand({
      logGroupName: LOG_GROUP_NAME,
      orderBy: 'LastEventTime',
      descending: true,
      limit: 50 // Get the 50 most recent streams
    });

    const response = await client.send(command);
    
    // Filter streams for backend pods
    return response.logStreams
      ?.filter(stream => stream.logStreamName?.includes('backend'))
      .slice(0, 20) // Take only the 20 most recent backend streams
      .map(stream => stream.logStreamName)
      .filter((name): name is string => name !== undefined) || [];

  } catch (error) {
    console.error("Error fetching log streams:", error);
    return [];
  }
}

async function fetchAllMatchingLogs(streamNames: string[], startTime?: number, endTime?: number) {
  let allLogs: any[] = [];
  let nextToken: string | undefined;

  try {
    do {
      const command = new FilterLogEventsCommand({
        logGroupName: LOG_GROUP_NAME,
        logStreamNames: streamNames,
        startTime,
        endTime,
        nextToken,
        limit: 1000,
        filterPattern: '{ $.log = "*logger_name*" && $.log = "*agent_id*" }' // Filter for logs containing our required fields
      });

      const response = await client.send(command);
      
      if (response.events) {
        allLogs = [...allLogs, ...response.events];
      }

      nextToken = response.nextToken;
    } while (nextToken);

    return allLogs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
}

async function getCloudWatchLogs(params: any = {}) {
  try {
    // // Calculate time range (default to last 24 hours if not specified)
    // const endTime = params.endTime || Date.now();
    // const startTime = params.startTime || endTime - (24 * 60 * 60 * 1000); // 24 hours ago

    // Get most recent backend streams
    const backendStreams = await getRecentBackendLogStreams();
    
    if (backendStreams.length === 0) {
      console.warn("No backend log streams found");
      return { data: [], total: 0, success: true };
    }

    // Fetch all matching logs
    // const logEvents = await fetchAllMatchingLogs(backendStreams, startTime, endTime);
    const logEvents = await fetchAllMatchingLogs(backendStreams); // use without time range

    const logItems: LogsTableItem[] = logEvents
      .map((event) => {
        try {
          // Parse the outer JSON structure
          const outerJson = JSON.parse(event.message?.trim() || '');
          
          // Parse the inner log JSON string
          const logJson = JSON.parse(outerJson.log);
          
          // Get the kubernetes metadata
          const k8sMeta = outerJson.kubernetes;

          // Only return if it matches our expected format
          if (!logJson.logger_name || !logJson.agent_id) {
            return null;
          }

          return {
            loggerName: logJson.logger_name,
            logLevel: logJson.level,
            timestamp: new Date(logJson['@timestamp']),
            message: logJson.message,
            agent_id: logJson.agent_id,
            date_time: new Date(logJson.date_time),
            podName: k8sMeta.pod_name,
            containerName: k8sMeta.container_name,
            namespace: k8sMeta.namespace_name
          };
        } catch (error) {
          return null;
        }
      })
      .filter((item): item is LogsTableItem => item !== null);

    return {
      data: logItems,
      total: logItems.length,
      success: true
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return {
      data: [],
      total: 0,
      success: false
    };
  }
}

type LogsTableItem = {
  loggerName: string;
  logLevel: string;
  timestamp: Date;
  message: string;
  agent_id: string;
  date_time: Date;
  podName: string;
  containerName: string;
  namespace: string;
};

// Define the columns for the table
const columns: ProColumns<LogsTableItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: 'Logger Name',
    dataIndex: 'loggerName',
    copyable: true,
    search: true,
    ellipsis: true,
  },
  {
    title: 'Agent ID',
    dataIndex: 'agent_id',
    copyable: true,
    search: true,
  },
  {
    title: 'Log Level',
    dataIndex: 'logLevel',
    filters: [
      { text: 'INFO', value: 'INFO' },
      { text: 'ERROR', value: 'ERROR' },
      { text: 'WARN', value: 'WARN' },
    ],
    filterMultiple: false,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    copyable: true,
    ellipsis: true,
    search: true,
  },
  {
    title: 'Pod Name',
    dataIndex: 'podName',
    copyable: true,
    search: true,
    ellipsis: true,
    hideInTable: true,
  },
  {
    title: 'Container',
    dataIndex: 'containerName',
    copyable: true,
    search: true,
    hideInTable: true,
  },
  {
    title: 'Namespace',
    dataIndex: 'namespace',
    copyable: true,
    hideInTable: true,
  },
  {
    title: 'Date Time',
    dataIndex: 'date_time',
    valueType: 'dateTime',
    sorter: true,
    search: true,
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    valueType: 'dateTime',
    sorter: true,
  },
];

export default () => {
  return (
    <ConfigProvider locale={enUS}>
      <ProTable<LogsTableItem>
        columns={columns}
        request={async (params, sort, filter) => {
          return getCloudWatchLogs(params);
        }}
        pagination={{
          pageSize: 10,
        }}
        rowKey={(record) => `${record.timestamp.getTime()}-${record.agent_id}-${record.podName}`}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        headerTitle="CloudWatch User Logs"
      />
    </ConfigProvider>
  );
};