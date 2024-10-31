import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import React from 'react';

// cognito integration
import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Import AWS types
type AWSCognitoUserType = CognitoIdentityServiceProvider.UserType;
type AWSCognitoListUsersResponse = CognitoIdentityServiceProvider.ListUsersResponse;
type AWSGroupType = CognitoIdentityServiceProvider.GroupType;
type AWSAdminListGroupsForUserResponse = CognitoIdentityServiceProvider.AdminListGroupsForUserResponse;

// Type for the params we pass to listUsers
type ListUsersParams = CognitoIdentityServiceProvider.ListUsersRequest;

type CognitoUserTableItem = {
  username: string;
  given_name: string;
  family_name: string;
  email: string;
  emailVerified: boolean;
  userId: string;
  enabled: boolean;
  status: AWSCognitoUserType['UserStatus'];
  created: Date;
  lastModified: Date;
  groups: string[]; // Add this field
};

// Update the transform function to include groups
const transformUser = (user: AWSCognitoUserType, groups: AWSGroupType[] = []): CognitoUserTableItem => {
  return {
    username: user.Username || '',
    given_name: user.Attributes?.find(attr => attr.Name === 'given_name')?.Value || '',
    family_name: user.Attributes?.find(attr => attr.Name === 'family_name')?.Value || '',
    email: user.Attributes?.find(attr => attr.Name === 'email')?.Value || '',
    emailVerified: user.Attributes?.find(attr => attr.Name === 'email_verified')?.Value === 'true',
    userId: user.Attributes?.find(attr => attr.Name === 'sub')?.Value || '',
    enabled: user.Enabled || false,
    status: user.UserStatus || 'UNKNOWN',
    created: new Date(user.UserCreateDate || ''),
    lastModified: new Date(user.UserLastModifiedDate || ''),
    groups: groups.map(g => g.GroupName || '') // Add this field
  };
};

const fetchUsers = async (params?: ListUsersParams) => {
  try {
    const cognitoISP = new CognitoIdentityServiceProvider({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: "AKIAVD3BDD5QBC4X7FU2",
        secretAccessKey: "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"
      }
    });

    // fetch all users
    const response: AWSCognitoListUsersResponse = await cognitoISP.listUsers(params || {
      UserPoolId: "ap-southeast-1_ya55bZ0sg",
      Limit: 20,
    }).promise();

    // Fetch groups for each user. 2n+1 computational complexity.
    const usersWithGroups = await Promise.all((response.Users || []).map(async (user) => {
      if (!user.Username) return transformUser(user);

      try {
        const groupsResponse: AWSAdminListGroupsForUserResponse = await cognitoISP.adminListGroupsForUser({
          Username: user.Username,
          UserPoolId: params?.UserPoolId || "ap-southeast-1_ya55bZ0sg",
        }).promise();

        return transformUser(user, groupsResponse.Groups || []);
      } catch (error) {
        console.error(`Error fetching groups for user ${user.Username}:`, error);
        return transformUser(user);
      }
    }));

    return {
      data: usersWithGroups,
      total: usersWithGroups.length,
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


const columns: ProColumns<CognitoUserTableItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48
  },
  {
    title: 'First Name',
    dataIndex: 'given_name',
    copyable: true,
    ellipsis: true,
  },
  {
    title: 'Last Name',
    dataIndex: 'family_name',
    copyable: true,
    ellipsis: true,
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
    valueEnum: {
      true: { text: 'true'},
      false: { text: 'false'},
    }
  },
  {
    title: 'Groups',
    dataIndex: 'groups',
    render: (_, record) => (
      <Space>
        {record.groups.map((group) => (
          <Tag key={group} color="blue">
            {group}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'User ID',
    dataIndex: 'userId',
    copyable: true,
    ellipsis: true,
    hideInTable: true,
    
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    filters: true,
    onFilter: true,
    valueEnum: {
      true: { text: 'true'},
      false: { text: 'false'},
    }
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
    hideInSearch: true,
    hideInTable: true,
    sorter: true
  },
  {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    hideInSearch: true,
    hideInTable: true,
    valueType: 'date',
    sorter: true
  },
];

export default () => {
  return (
    <ProTable<CognitoUserTableItem>
      columns={columns}
      request={async (params, sort, filter) => {
        return fetchUsers({
      UserPoolId: "ap-southeast-1_ya55bZ0sg",
      Limit: 20,
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