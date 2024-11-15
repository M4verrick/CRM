import React from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, DatePicker, Input, Select, Card, message } from "antd";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import api from 'services/api';

const { Option } = Select;

const currencies = [
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "DKK", name: "Danish Krone" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "USD", name: "United States Dollar" }
];

const NewAccount = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    try {
      const formattedValues = {
        "profile": {
          "id": values.profileId,
        },
        "accountType": values.accountType,
        "accountStatus": values.accountStatus,
        "currency": values.currency,
        "branchId": values.branchId,
        "initialDeposit": values.initialDeposit,
      }

      console.log(formattedValues);

      const userData = await api.createAccount(formattedValues);
      
      if (userData) {
        messageApi.success('Account successfully registered!');
        form.resetFields();
      }
    } catch (err) {
      console.error('Failed to post a new account:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || 'Failed to register account. Please try again.';
        messageApi.error(errorMessage);
      } else if (err.request) {
        // Request made but no response
        messageApi.error('Network error. Please check your connection.');
      } else {
        // Other errors
        messageApi.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <PageContainer>
      {contextHolder}
    <Card>
    <ConfigProvider locale={enUS}>
    <div className="Form">
      <header className="Form-header">
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <Form.Item
            name="profileId"
            label="Client ID"
            rules={[
              {
                required: true,
                message: "Please enter your client ID",
              },
              { whitespace: false },
            ]}
            hasFeedback
          >
            <Input placeholder="client ID" />
          </Form.Item>

          <Form.Item 
            name="accountType"
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
              <Select.Option value="SAVINGS">Savings</Select.Option>
              <Select.Option value="CHECKING">Checking</Select.Option>
              <Select.Option value="BUSINESS">Business</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="accountStatus"
            label="Account Status"
            rules={[
              {
                required: true,
                message: "Please select account status",
              }
            ]}
            hasFeedback
          >
            <Select placeholder="Select account type">
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
              <Select.Option value="PENDING">Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="currency"
            label="Currency Type"
            rules={[
              {
                required: true,
                message: "Please select currency type",
              }
            ]}
            hasFeedback
          >
            <Select
              placeholder="Choose a currency"
              allowClear
            >
              {currencies.map(currency => (
                <Option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
                  name="branchId"
                  label="Branch ID"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your branch ID",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
            <Input placeholder="Type your branch ID" />
          </Form.Item>

          <Form.Item
            name="initialDeposit"
            label="Confirm initial deposit"
            rules={[
              {
                required: true,
                message: "Please enter your initial deposit",
              },
              { whitespace: false },
            ]}
            hasFeedback
          >
            <Input placeholder="Specify inital deposit" />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button block type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </header>
    </div>
    </ConfigProvider>
    </Card>
    </PageContainer>
  );
}


export default NewAccount;