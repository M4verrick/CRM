import api from 'services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Modal, message, Tag, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { useRef } from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

type ClientTableItem = {
  id: number;
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
  verificationToken: string;
  verificationStatus: string;
  clientAccounts: any[];
  emailVerified: boolean;
};

const handleEdit = async (record: ClientTableItem) => {
  try {
    const requestBody = {
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      phone: record.phone,
      address: record.address,
      city: record.city,
      state: record.state,
      country: record.country,
      zip: record.zip,
      dateOfBirth: record.dateOfBirth,
      gender: record.gender
    };

    await api.updateClient(record.id, record);
    message.success('User updated successfully');
  } catch (error) {
    message.error('Failed to update user');
    console.error('Error updating user:', error);
  }
};

const handleDelete = async (record: ClientTableItem) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this user?',
    content: `This will permanently delete user ${record.id}`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      try {
        await api.deleteClient(record.id);
        message.success('User deleted successfully');
      } catch (error) {
        message.error('Failed to delete client');
        console.error('Error deleting client:', error);
      }
    }
  });
};

const columns: ProColumns<ClientTableItem>[] = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    copyable: true,
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    copyable: true,
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
    copyable: true,
  },
  {
    title: 'City',
    dataIndex: 'city',
    hideInTable: true,
    copyable: true,
    ellipsis: true,
  },
  {
    title: 'State',
    dataIndex: 'state',
    hideInTable: true,
    copyable: true,
    ellipsis: true,
  },
  {
    title: 'Country',
    dataIndex: 'country',
    hideInTable: true,
    copyable: true,
    ellipsis: true,
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
    title: 'Verification Status',
    dataIndex: 'verificationStatus',
    render: (status) => (
      <Tag color={status === 'PENDING' ? 'orange' : 'green'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Email Verified',
    dataIndex: 'emailVerified',
    render: (verified) => (
      <Tag color={verified ? 'green' : 'red'}>
        {verified ? 'Verified' : 'Not Verified'}
      </Tag>
    ),
  },
  {
    title: 'Options',
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
      <a
        key="delete"
        onClick={() => handleDelete(record)}
      >
        Delete
      </a>,
    ],
  }
];

const fetchClients = async (params: {
  pageSize?: number;
  current?: number;
  keyword?: string;
}) => {
  try {
    const response = await api.getClients();
    
    // Assuming response is the array of clients
    const data = Array.isArray(response) ? response : [];
    
    // Handle pagination
    const startIndex = ((params.current || 1) - 1) * (params.pageSize || 10);
    const endIndex = startIndex + (params.pageSize || 10);
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      success: true,
      total: data.length
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    message.error('Failed to fetch clients');
    return {
      data: [],
      success: false,
      total: 0
    };
  }
};

export default () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();

  return (
    <ConfigProvider locale={enUS}>
      <ProTable<ClientTableItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          return fetchClients(params);
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
        rowKey="id"
        search={{
          labelWidth: 'auto'
        }}
        dateFormatter="string"
        headerTitle="Client Profiles"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // add new user
              navigate('/ClientForm');
              actionRef.current?.reload();
            }}
            type="primary"
          >
            Add new profile
          </Button>
        ]}
      />
    </ConfigProvider>
  );
};