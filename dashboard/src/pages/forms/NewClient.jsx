import React, { useState } from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, DatePicker, Input, Select, Card, message } from "antd";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

// api useHook
import { useApi } from 'hooks/useApi';

const NewClient = () => {
  const { loading, error, post } = useApi();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      // Format date before sending
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD')
      };

      const userData = await post('/clients', formattedValues);
      
      if (userData) {
        messageApi.success('Client successfully registered!');
        form.resetFields();
      }
    } catch (err) {
      console.error('Failed to post a new client:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || 'Failed to register client. Please try again.';
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
    <ConfigProvider locale={enUS}>
      <PageContainer>
        {contextHolder}
        <Card>
          <div className="Form">
            <header className="Form-header">
              <Form
                form={form}
                autoComplete="off"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                onFinish={onFinish}
                onFinishFailed={(error) => {
                  messageApi.error('Please check the form for errors.');
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
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="First Name" />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter last name",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Last Name" />
                </Form.Item>

                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[
                    {
                      required: true,
                      message: "Please provide your date of birth",
                    },
                  ]}
                  hasFeedback
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    picker="date"
                    placeholder="Choose date of birth"
                  />
                </Form.Item>

                <Form.Item name="gender" label="Gender" requiredMark="optional">
                  <Select placeholder="Select your gender">
                    <Select.Option value="MALE">Male</Select.Option>
                    <Select.Option value="FEMALE">Female</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    {
                      required: true,
                      message: "Enter a phone number",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Phone number" />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Enter an address",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Address" />
                </Form.Item>

                <Form.Item
                  name="state"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Enter a state",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="State" />
                </Form.Item>

                <Form.Item
                  name="city"
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Enter a city",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="City" />
                </Form.Item>

                <Form.Item
                  name="country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a country",
                    },
                    { whitespace: true },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Country" />
                </Form.Item>

                <Form.Item
                  name="zip"
                  label="Postal Code"
                  rules={[
                    {
                      required: true,
                      message: "Please enter postal code",
                    },
                    { whitespace: false },
                    { min: 3 },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Postal Code" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button 
                    block 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
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

export default NewClient;