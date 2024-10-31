import React from 'react';
import { Table, Tag } from 'antd';
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const RecentActivitiesTable = () => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text) => <span><UserOutlined /> {text}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <span> {text}</span>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Tag color={record.actionColor} icon={record.actionIcon}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const data = [
    {
      key: '1',
      user: 'John Doe',
      role: 'agent',
      action: 'Deleted Profile',
      actionColor: 'red',
      actionIcon: <DeleteOutlined />,
      date: '2024-10-13 14:30',
    },
    {
      key: '2',
      user: 'Jane Smith',
      role: 'agent',
      action: 'Updated Profile',
      actionColor: 'blue',
      actionIcon: <EditOutlined />,
      date: '2024-10-13 13:45',
    },
    {
      key: '3',
      user: 'Bob Johnson',
      role: 'agent',
      action: 'Deleted Profile',
      actionColor: 'red',
      actionIcon: <DeleteOutlined />,
      date: '2024-10-13 12:15',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};

export default RecentActivitiesTable;
