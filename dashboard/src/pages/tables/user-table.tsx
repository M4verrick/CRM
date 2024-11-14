import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Modal, message, Space, Tag } from 'antd';
import React from 'react';
import { useRef } from 'react';

// cognito integration
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

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

const fetchUsers = async (params: {
  given_name?: string,
  family_name?: string,
  email?: string,
  email_verified?: boolean,
  userId?: string,
  enabled?: boolean,
  status?: string,
  created?: Date;
  lastModified?: Date;
  groups?: string[]; 
}
) => {
  try {
    const cognitoISP = new CognitoIdentityServiceProvider({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      }
    });

    // fetch all users
    const response: AWSCognitoListUsersResponse = await cognitoISP.listUsers({
      UserPoolId: import.meta.env.VITE_USER_POOL_ID,
      Limit: 20,
    }).promise();

    // Fetch groups for each user. 2n+1 computational complexity.
    let usersWithGroups = await Promise.all((response.Users || []).map(async (user) => {
      if (!user.Username) return transformUser(user);

      try {
        const groupsResponse: AWSAdminListGroupsForUserResponse = await cognitoISP.adminListGroupsForUser({
          Username: user.Username,
          UserPoolId: params?.UserPoolId || import.meta.env.VITE_USER_POOL_ID,
        }).promise();

        return transformUser(user, groupsResponse.Groups || []);
      } catch (error) {
        console.error(`Error fetching groups for user ${user.Username}:`, error);
        return transformUser(user);
      }
    }));

    // Apply filters based on search params
    if (params.given_name) {
      usersWithGroups = usersWithGroups.filter(item => 
        item.given_name.toLowerCase().includes(params.given_name!.toLowerCase()))
    }
    if (params.family_name) {
      usersWithGroups = usersWithGroups.filter(item =>
        item.family_name.toLowerCase().includes(params.family_name!.toLowerCase()))
    }
    if (params.email) {
      usersWithGroups = usersWithGroups.filter(item =>
        item.email.toLowerCase().includes(params.email!.toLowerCase()))
    }
    if (params.email_verified !== undefined) {
      usersWithGroups = usersWithGroups.filter(item =>
        item.emailVerified === params.email_verified)
    }
    if (params.userId) {
      usersWithGroups = usersWithGroups.filter(item =>
        item.userId.toLowerCase().includes(params.userId!.toLowerCase()))
    }
    if (params.enabled !== undefined) {
      usersWithGroups = usersWithGroups.filter(item =>
        item.enabled === params.enabled)
    }
    if (params.status) {
      usersWithGroups = usersWithGroups.filter(item =>
        item.status.toLowerCase().includes(params.status!.toLowerCase()))
    }


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

// Handle functions in options column
const handleEdit = async (record: CognitoUserTableItem) => {
  const cognitoISP = new CognitoIdentityServiceProvider({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    }
  });

  try {
    await cognitoISP.adminUpdateUserAttributes({
      UserPoolId: import.meta.env.VITE_USER_POOL_ID,
      Username: record.username,
      UserAttributes: [
        {
          Name: 'given_name',
          Value: record.given_name
        },
        {
          Name: 'family_name',
          Value: record.family_name
        },
        {
          Name: 'email',
          Value: record.email
        }
      ]
    }).promise();
    message.success('User updated successfully');
  } catch (error) {
    message.error('Failed to update user');
    console.error('Error updating user:', error);
  }
};

const handleDelete = async (record: CognitoUserTableItem) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this user?',
    content: `This will permanently delete user ${record.email}`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: async () => {
      const cognitoISP = new CognitoIdentityServiceProvider({
        region: import.meta.env.VITE_AWS_REGION,
        credentials: {
          accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
          secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        }
      });

      try {
        await cognitoISP.adminDeleteUser({
          UserPoolId: import.meta.env.VITE_USER_POOL_ID,
          Username: record.username
        }).promise();
        message.success('User deleted successfully');
      } catch (error) {
        message.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  });
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
    width: 140,
  },
  {
    title: 'Last Name',
    dataIndex: 'family_name',
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
    title: 'Email Verified',
    dataIndex: 'emailVerified',
    editable: false,
    valueEnum: {
      true: { text: 'true' },
      false: { text: 'false' },
    }
  },
  {
    title: 'Groups',
    dataIndex: 'groups',
    editable: false,
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
    editable: false,
    copyable: true,
    search: false,
    ellipsis: true,
    hideInTable: true,
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    editable: false,
    filters: true,
    search: false,
    onFilter: true,
    valueEnum: {
      true: { text: 'true' },
      false: { text: 'false' },
    }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    editable: false,
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
    editable: false,
    valueType: 'date',
    hideInTable: true,
    sorter: true
  },
  {
    title: 'Last Modified',
    dataIndex: 'lastModified',
    editable: false,
    hideInTable: true,
    valueType: 'date',
    sorter: true
  },
  {
    title: 'Options',
    valueType: 'option',
    editable: false,
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={ async() => {
          action?.startEditable?.(record.userId);
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
      <ProTable<CognitoUserTableItem>
        columns={columns}
        actionRef={actionRef}
        request={fetchUsers}
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
        headerTitle="Cognito Users"
      />
    </ConfigProvider>
  );
};