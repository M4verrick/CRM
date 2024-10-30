import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import React from 'react';

// cognito integration
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const fetchUsers = async (params?: ListUsersParams) => {
  try {
    const cognitoISP = new CognitoIdentityServiceProvider({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: "AKIAVD3BDD5QBC4X7FU2",
        secretAccessKey: "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"
      }
    });

    // bug here
    const response: AWSCognitoListUsersResponse = await cognitoISP.listUsers(params || {
      UserPoolId: "ap-southeast-1_ya55bZ0sg",
      Limit: 20,
    }).promise();
    console.error('Done fetching users:');

    const usersList = (response.Users || []).map(transformUser);
    return {
      data: usersList,
      total: usersList.length,
      success: true
    };
  } catch (err) {
    console.error('Error fetching users:', err);
    return {
      data: [],
      total: 0,
      success: false,
      error: err instanceof Error ? err.message : 'An error occurred'
    };
  }
};

// Import AWS types
type AWSCognitoUserType = CognitoIdentityServiceProvider.UserType;
type AWSCognitoListUsersResponse = CognitoIdentityServiceProvider.ListUsersResponse;
// type AWSAttributeType = CognitoIdentityServiceProvider.AttributeType;

// Type for the params we pass to listUsers
type ListUsersParams = CognitoIdentityServiceProvider.ListUsersRequest;

type CognitoUserTableItem = {
  username: string;
  email: string;
  emailVerified: boolean;
  userId: string;
  enabled: boolean;
  status: AWSCognitoUserType['UserStatus'];
  created: Date;
  lastModified: Date;
};

const transformUser = (user: AWSCognitoUserType): CognitoUserTableItem => {
  return {
    username: user.Username || '',
    email: user.Attributes?.find(attr => attr.Name === 'email')?.Value || '',
    emailVerified: user.Attributes?.find(attr => attr.Name === 'email_verified')?.Value === 'true',
    userId: user.Attributes?.find(attr => attr.Name === 'sub')?.Value || '',
    enabled: user.Enabled || false,
    status: user.UserStatus || 'UNKNOWN',
    created: new Date(user.UserCreateDate || ''),
    lastModified: new Date(user.UserLastModifiedDate || '')
  };
};

const columns: ProColumns<CognitoUserTableItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: 'Username',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true
  },
  {
    title: 'Email',
    dataIndex: 'email',
    copyable: true,
    ellipsis: true
  },
  {
    title: 'Email Verified',
    dataIndex: 'emailVerified',
    valueType: 'checkbox'
  },
  {
    title: 'User ID',
    dataIndex: 'userId',
    copyable: true,
    ellipsis: true
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    valueType: 'checkbox'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: true,
    onFilter: true,
    valueEnum: {
      UNCONFIRMED: { text: 'Unconfirmed', status: 'Secondary' },
      CONFIRMED: { text: 'Confirmed', status: 'Success' },
      ARCHIVED: { text: 'Archived', status: 'Default' },
      COMPROMISED: { text: 'Compromised', status: 'Error' },
      UNKNOWN: { text: 'Unknown', status: 'Warning' },
      RESET_REQUIRED: { text: 'Reset Required', status: 'Processing' },
      FORCE_CHANGE_PASSWORD: { text: 'Force Change Password', status: 'Processing' }
    }
  },
  {
    title: 'Created At',
    dataIndex: 'created',
    valueType: 'date',
    sorter: true
  },
  {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    valueType: 'date',
    sorter: true
  }
];

export default () => {
  return (
    <ProTable<CognitoUserTableItem>
      columns={columns}
      request={async (params, sort, filter) => {
        return fetchUsers({
          UserPoolId: "ap-southeast-1_ya55bZ0sg",
        });
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
      headerTitle="Cognito Users"
    />
  );
};