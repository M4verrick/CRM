import React from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, DatePicker, Input, Select, Card, message } from "antd";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

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

// api useHook
import { useApi } from 'hooks/useApi';

// TODO: backend handles invalid client ID? Test if it works. 
// Edit fields to match endpoint
const NewAccount = () => {
  const { loading, error, post } = useApi();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {

      const userData = await post('accounts', values);
      
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
    <Card>
    <ConfigProvider locale={enUS}>
    <div className="Form">
      <header className="Form-header">
        <Form
          autoComplete="off"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log({ error });
          }}
        >
          <Form.Item
            name="clientID"
            label="Client ID"
            rules={[
              {
                required: true,
                message: "Please enter your client ID",
              },
              { whitespace: false },
              { min: 3 },
            ]}
            hasFeedback
          >
            <Input placeholder="client ID" />
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
              <Select.Option value="agent">Savings</Select.Option>
              <Select.Option value="admin">Transactions</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="type"
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
            name="branchID"
            label="Branch ID"
            rules={[
              {
                required: true,
                message: "Please enter your branch ID",
              },
              { whitespace: false },
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
                type: "url",
                required: true,
                message: "Please enter your initial deposit",
              },
              { whitespace: false },
              { min: 3 },
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