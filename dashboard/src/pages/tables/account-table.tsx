import api from "../../services/api"
import type { ProColumns } from '@ant-design/pro-components';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { useRef } from "react";
import { message, Button, ConfigProvider, Modal } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { useNavigate } from "react-router-dom";

// table item type
type AccountTableItem = {
  key: string;
  profileId: number;
  accountId: number;
  accountType: string;
  accountStatus: string;
  openingDate: string;
  currency: string;
  branchId: string;
  initialDeposit: number;
};

// columns definition
const columns: ProColumns<AccountTableItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Profile ID',
    dataIndex: 'profileId',
    width: 100,
  },
  {
    title: 'Account ID',
    dataIndex: 'accountId',
    width: 100,
  },
  {
    title: 'Account Type',
    dataIndex: 'accountType',
    filters: true,
    onFilter: true,
    search: false,
    width: 120,
    valueEnum: {
      SAVINGS: { text: 'Savings' },
      CHECKING: { text: 'Checking' },
      BUSINESS: { text: 'Business' },
    },
  },
  {
    title: 'Status',
    dataIndex: 'accountStatus',
    filters: true,
    onFilter: true,
    search: false,
    width: 100,
    valueEnum: {
      ACTIVE: { text: 'Active', status: 'Success' },
      INACTIVE: { text: 'Inactive', status: 'Error' },
      PENDING: { text: 'Pending', status: 'Processing' },
    },
  },
  {
    title: 'Opening Date',
    dataIndex: 'openingDate',
    width: 120,
    valueType: 'date',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    width: 100,
  },
  {
    title: 'Branch ID',
    dataIndex: 'branchId',
    width: 100,
  },
  {
    title: 'Initial Deposit',
    dataIndex: 'initialDeposit',
    width: 120,
    valueType: 'money',
  },
  {
    title: 'Options',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="delete"
        onClick={() => handleDelete(record)}
      >
        Delete
      </a>,
    ],
  }
];

const handleDelete = async (record: AccountTableItem) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this account?',
    content: `This will permanently delete account ${record.accountId}`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      try {
        await api.deleteAccount(record.accountId);
        message.success('Account deleted successfully');
      } catch (error) {
        message.error('Failed to delete account. Users can only delete accounts for clients they are responsible for.');
        console.error('Error deleting account:', error);
      }
    }
  });
};

// Fetch function, manages pagination and filtering
const fetchAccounts = async (params: {
  current?: number;
  pageSize?: number;
  profileId?: number;
  accountId?: number;
  accountType?: string;
  accountStatus?: string;
  openingDate?: string;
  currency?: string;
  branchId?: string;
  initialDeposit?: number;
}) => {
  const data = await api.getAccounts();
  // This would normally be an API call, but for this example we'll use static data
  // const data: ProfileAccount[] = [];

  // Transform the nested data structure into a flat array for the table
  let flattenedData: AccountTableItem[] = data.flatMap(profile =>
    profile.accounts.map(account => ({
      key: account.accountId.toString(),
      profileId: profile.profileId,
      ...account,
    }))
  );

    // Apply filters based on search params
    if (params.profileId) {
      flattenedData = flattenedData.filter(item => 
        item.profileId == params.profileId);
    }
    if (params.accountId) {
      flattenedData = flattenedData.filter(item => 
        item.accountId == params.accountId);
    }
    if (params.accountType) {
      flattenedData = flattenedData.filter(item => 
        item.accountType.toLowerCase().includes(params.accountType!.toLowerCase())
      );
    }
    if (params.accountStatus) {
      flattenedData = flattenedData.filter(item =>
        item.accountStatus.toLowerCase().includes(params.accountStatus!.toLowerCase())
      );
    }
    if (params.openingDate) {
      flattenedData = flattenedData.filter(item =>
        item.openingDate.toLowerCase().includes(params.openingDate!.toLowerCase())
      );
    }
    if (params.currency) {
      flattenedData = flattenedData.filter(item =>
        item.currency.toLowerCase().includes(params.currency!.toLowerCase())
      );
    }
    if (params.branchId) {
      flattenedData = flattenedData.filter(item =>
        item.branchId.toLowerCase().includes(params.branchId!.toLowerCase())
      );
    }
    if (params.initialDeposit) {
      flattenedData
      .filter(item => item.initialDeposit == params.initialDeposit)
    };

  // Handle pagination
  const startIndex = ((params.current || 1) - 1) * (params.pageSize || 10);
  const endIndex = startIndex + (params.pageSize || 10);

  return {
    data: flattenedData.slice(startIndex, endIndex),
    total: flattenedData.length,
    success: true,
  };
};

// Update the ProTable component
export default () => {
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();

  return (
    <ConfigProvider locale={enUS}>
      <ProTable<AccountTableItem>
        columns={columns}
        request={fetchAccounts}
        rowKey="accountId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
        dateFormatter="string"
        headerTitle="Bank Accounts"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // add new user
              navigate('/UserForm');
              actionRef.current?.reload();
            }}
            type="primary"
          >
            Add new user
          </Button>
        ]}
      />
    </ConfigProvider>
  );
};