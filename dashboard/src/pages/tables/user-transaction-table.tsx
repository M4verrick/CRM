import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import React from 'react';

// TODO: make the searchable params functional

// cloudwatch integration
import { CloudWatchLogsClient, FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

const client = new CloudWatchLogsClient({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIAVD3BDD5QBC4X7FU2",
    secretAccessKey: "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"
  }
});

async function getCloudWatchLogs() {
  const command = new FilterLogEventsCommand({
    logGroupName: "crm-logs",         // Specify the log group
    // startTime: Date.now() - 60 * 60 * 1000,  // Adjust the time range (e.g., last hour)
    // endTime: Date.now(),
    limit: 100,            // Set a limit for the number of logs returned
  });

  try {
    const response = await client.send(command);
    response.events.forEach((event) => {
      console.log(`Timestamp: ${new Date(event.timestamp)}, Message: ${event.message}`);
    });

    const logItems: LogsTableItem[] = response.events?.map((event) => {
      // Parse the JSON message
      let parsedMessage;
      try {
        // Double unescape approach
        const unescapedMessage = event.message.replace(/\\\\/g, '\\');
        parsedMessage = JSON.parse(JSON.parse(`"${unescapedMessage}"`));
      } catch (error) {
        console.error("Failed to parse log message:", error);
        return null;  // Skip if parsing fails
      }

      // Return as a LogsTableItem
      return {
        loggerName: parsedMessage.loggerName,
        logLevel: parsedMessage.logLevel,
        timestamp: new Date(parsedMessage.timestamp),
        message: parsedMessage.message,
        agent_id: parsedMessage.mdc.agent_id,
        date_time: new Date(parsedMessage.mdc.date_time),
      };
    }).filter(item => item !== null) as LogsTableItem[];

    return {
      data: logItems,
      total: logItems.length,
      success: true
    };
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
}


type LogsTableItem = {
  loggerName: string;
  logLevel: string;
  timestamp: Date;
  message: string;
  agent_id: string;
  date_time: Date;
};

const columns: ProColumns<LogsTableItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: 'logger name',
    dataIndex: 'loggerName',
    copyable: true,
  },
  {
    title: 'Agent ID',
    dataIndex: 'agent_id',
    copyable: true,
  },
  {
    title: 'Log Level',
    dataIndex: 'logLevel',
    hideInTable: true,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    copyable: true,
    width: 200,
  },
  {
    title: 'Date Time',
    dataIndex: 'date_time',
    valueType: 'date',
    sorter: true
  },
  {
    title: 'Time Stamp',
    dataIndex: 'timestamp',
    valueType: 'date',
    sorter: true
  },
];

export default () => {
  return (
    <ConfigProvider locale={enUS}>
      <ProTable<LogsTableItem>
        columns={columns}
        request={async (params, sort, filter) => {
          return getCloudWatchLogs();
        }}
        pagination={{
          pageSize: 10,
          current: 1
        }}
        rowKey="username"
        search={{
          labelWidth: 'auto'
        }}
        dateFormatter="string"
        headerTitle="CloudWatch logs"
      />
    </ConfigProvider>
  );
};

