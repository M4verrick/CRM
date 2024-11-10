import api from 'services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Modal, message, Space, Tag } from 'antd';
import React from 'react';
import { useRef } from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

type ClientTableItem = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
};

// Handle functions in options column
const handleEdit = async (record: ClientTableItem) => {
  try {
    message.success('User updated successfully');
  } catch (error) {
    message.error('Failed to update user');
    console.error('Error updating user:', error);
  }
};

const handleDelete = async (record: ClientTableItem) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this user?',
    content: `This will permanently delete user ${record.email}`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
  });
};

const columns: ProColumns<ClientTableItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    copyable: true,
    width: 140,
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    copyable: true,
    width: 140,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    copyable: true,
    ellipsis: true
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    ellipsis: true,
  },
  {
    title: 'City',
    dataIndex: 'city',
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'Country',
    dataIndex: 'country',
  },
  {
    title: 'ZIP',
    dataIndex: 'zip',
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dateOfBirth',
    valueType: 'date',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    valueEnum: {
      MALE: { text: 'Male' },
      FEMALE: { text: 'Female' },
      OTHER: { text: 'Other' },
    }
  },
  {
    title: 'Options',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.email);
        }}
      >
        Edit
      </a>,
      <a
        key="delete"
        onClick={() => handleDelete(record)}
      >
        Delete
      </a>,
    ],
  }
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ConfigProvider locale={enUS}>
      <ProTable<ClientTableItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const response = await api.getClients();
          const data = response.data || []; // Provide empty array as fallback
          console.log(data);
          return {
            data: data,
            success: true,
            total: data.length
          };
        }}
        editable={{
          type: 'multiple',
          onSave: async (rowKey, data, row) => {
            await handleEdit(data);
            actionRef.current?.reload();
          },
        }}
        pagination={{
          pageSize: 10,
          current: 1
        }}
        rowKey="userId"
        search={{
          labelWidth: 'auto'
        }}
        dateFormatter="string"
        headerTitle="Client Profiles"
      />
    </ConfigProvider>
  );
};