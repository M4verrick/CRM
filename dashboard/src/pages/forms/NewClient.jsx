import React from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, Checkbox, DatePicker, Input, Select, Card } from "antd";
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

const NewClient = () => {
  return (
    <ConfigProvider locale={enUS}>
    <PageContainer>
    <Card>
    <div className="Form">
      <header className="Form-header">
        <Form
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={(values) => {
            console.log({ values });
          }}
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
              { min: 3 },
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
              { min: 3 },
            ]}
            hasFeedback
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="dob"
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
              placeholder="Chose date of birth"
            />
          </Form.Item>


          <Form.Item name="gender" label="Gender" requiredMark="optional">
            <Select placeholder="Select your gender">
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
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
            name="postalcode"
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


export default NewClient;