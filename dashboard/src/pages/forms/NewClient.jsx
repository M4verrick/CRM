import React, { useState } from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, DatePicker, Input, Select, Card, message } from "antd";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

// api useHook
import api from 'services/api';

const NewClient = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      // Format date and ensure phone number has + prefix
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        phone: values.phone.startsWith('+') ? values.phone : `+${values.phone}`
      };

      const userData = await api.createClientAccount(formattedValues);
    
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
                  <Form.Item name="gender" label="Gender" rules={[{ required: true }]} hasFeedback>
                    <Select placeholder="Select your gender">
                      <Select.Option value="MALE">Male</Select.Option>
                      <Select.Option value="FEMALE">Female</Select.Option>
                      <Select.Option value="OTHER">Other</Select.Option>
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
                      message: "Enter a phone number"
                    },
                    {
                      pattern: /^\+?[1-9]\d{1,14}$/,
                      message: "Please enter a valid phone number"
                    }
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Phone number (e.g. +1234567890)" />
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
                  label="Zip Code"
                  rules={[
                    {
                      required: true,
                      message: "Please enter zip code"
                    },
                    {
                      pattern: /^\d{5,10}$/,
                      message: "Please enter a valid zip code"
                    }
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Zip Code" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button 
                    block 
                    type="primary" 
                    htmlType="submit"
                  >
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

export default NewClient;