import React from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, Input, Select, Card, Modal } from "antd";
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

const NewUser = () => {
  const [form] = Form.useForm();

  const createUserInCognito = async (userData) => {
    // Configure the AWS SDK with your credentials and region
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      }
    });

    // Set up the parameters for creating a new user
    const params = {
      UserPoolId: import.meta.env.VITE_USER_POOL_ID,
      Username: userData.email,
      TemporaryPassword: generateTemporaryPassword(),
      UserAttributes: [
        {
          Name: 'email',
          Value: userData.email
        },
        {
          Name: 'given_name',
          Value: userData.firstName
        },
        {
          Name: 'family_name',
          Value: userData.lasttName
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ],
      MessageAction: 'SUPPRESS' // If you want to handle sending credentials yourself
    };

    try {
      // Create the user
      const createUserResponse = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
      
      // If user creation was successful, add them to their group
      if (createUserResponse.User) {
        const addToGroupParams = {
          UserPoolId: import.meta.env.VITE_USER_POOL_ID,
          Username: userData.email,
          GroupName: userData.type // 'agent' or 'admin' from the form
        };

        await cognitoIdentityServiceProvider.adminAddUserToGroup(addToGroupParams).promise();
        return createUserResponse.User;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const generateTemporaryPassword = () => {
    // Generate a random temporary password that meets Cognito's requirements
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'A'; // Uppercase
    password += 'a'; // Lowercase
    password += '1'; // Number
    password += '!'; // Special character
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  };

  const onFinish = async (values) => {
    try {
      // Create the user in Cognito
      const user = await createUserInCognito(values);
      
      // If successful, show success message
      Modal.success({
        title: 'Success',
        content: 'User has been successfully created! A temporary password will be sent to their email.',
        onOk() {
          form.resetFields();
        },
      });
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        message.error('A user with this email already exists.');
        form.setFields([
          {
            name: 'email',
            errors: ['A user with this email already exists'],
          },
        ]);
      } else {
        message.error('An error occurred while creating the user. Please try again.');
      }
    }
  };

  return (
    <ConfigProvider locale={enUS}>
    <PageContainer>
    <Card>
    <div className="Form">
      <header className="Form-header">
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please enter first name",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="lasttName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please enter last name",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter an email",
              },
              { type: "email", message: "Please enter a valid email" },
            ]}
            hasFeedback
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item 
            name="type"
            label="Account Type"
            rules={[
              {
                required: true,
                message: "Please select account type",
              }
            ]}
            hasFeedback
          >
            <Select placeholder="Select account type">
              <Select.Option value="agent">agent</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button block type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </header>
    </div>
    </Card>
    </PageContainer>
    </ConfigProvider>
  );
}


export default NewUser;