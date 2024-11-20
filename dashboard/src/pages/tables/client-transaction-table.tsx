import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, Modal, message, } from 'antd';
import React, { useRef } from 'react';
import api from 'services/api';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

// Define table items
type TransactionItem = {
  id: number;
  client_id: number;
  transaction_type: string;
  amount: string;
  transaction_date: string;
  status: string;
};

const columns: ProColumns<TransactionItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Client ID',
    dataIndex: 'client_id',
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transaction_type',
    valueType: 'text',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    valueType: 'money',
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transaction_date',
    valueType: 'date',
    sorter: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      Completed: { text: 'Completed', status: 'Success' },
      Pending: { text: 'Pending', status: 'Processing' },
      Failed: { text: 'Failed', status: 'Error' },
    },
  },
  {
    title: 'Actions',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        Edit
      </a>,
      <TableDropdown
        key="actionGroup"
        menus={[
          { key: 'copy', name: 'Copy' },
          { key: 'delete', name: 'Delete' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ConfigProvider locale={enUS}>
      <ProTable<TransactionItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params: { pageSize?: number; current?: number; [key: string]: any }, sort, filter) => {
          console.log('Search params:', params);
          console.log('Sort params:', sort);
          console.log('Filter params:', filter);
      
          try {
              // Fetch the full data from the API
              const response = await api.getTransactionsByAgent("AGENT_001");
              console.log(response, 'um?');
      
              // Cast the response to the expected data format
              const data: TransactionItem[] = response as unknown as TransactionItem[];
      
              // Step 1: Perform front-end filtering
              const filteredData = data.filter((item) => {
                  let matches = true;
      
                  // Match Client ID (if provided)
                  if (params.client_id && !`${item.client_id}`.includes(`${params.client_id}`)) {
                      matches = false;
                  }
      
                  // Match Transaction Type (if provided)
                  if (params.transaction_type && !item.transaction_type.toLowerCase().includes(params.transaction_type.toLowerCase())) {
                      matches = false;
                  }
      
                  // Match Amount (if provided, allow partial matches)
                  if (params.amount && !`${item.amount}`.includes(`${params.amount}`)) {
                      matches = false;
                  }
      
                  return matches;
              });
      
              // Step 2: Perform front-end sorting (if required)
              const sortedData = sort?.transaction_date
                ? filteredData.sort((a, b) => {
                    const dateA = new Date(a.transaction_date).getTime();
                    const dateB = new Date(b.transaction_date).getTime();
                    return sort.transaction_date === 'ascend' ? dateA - dateB : dateB - dateA;
                })
                : filteredData;
      
              // Step 3: Apply pagination
              const current = params.current || 1; // Current page number
              const pageSize = params.pageSize || 10; // Items per page
              const paginatedData = sortedData.slice((current - 1) * pageSize, current * pageSize);
      
              // Return the processed data
              return {
                  data: paginatedData,        // Data for the current page
                  total: filteredData.length, // Total number of matching records
                  success: true,             // Indicate successful data retrieval
              };
          } catch (error) {
              console.error('Error fetching transactions:', error);
      
              // Return fallback values in case of an error
              return {
                  data: [],
                  total: 0,
                  success: false,
              };
          }
      }}
      
      
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="Transaction Table"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={async () => {
              try {
                console.log('called');
                // Call the API to retrieve updated transactions
                await api.retrieveUpdatedTransaction();

                // Refresh the table
                window.location.reload();
                message.success('Transactions updated successfully');
              } catch (error) {
                // Handle any errors
                message.error('Failed to retrieve updated transactions');
                console.error('Error:', error);
              }
            }}
            type="primary"
          >
            Retrieve Transactions
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                { label: '1st item', key: '1' },
                { label: '2nd item', key: '2' },
                { label: '3rd item', key: '3' },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </ConfigProvider>
  );
};
