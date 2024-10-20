import React from 'react';
import "./Form.css";
import { PageContainer } from '@ant-design/pro-components';
import { Form, Button, Input, Select, Card, Modal } from "antd";
import axios from 'axios';


const NewUser = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Send form data to backend
      const response = await axios.post('/api/validate-form', values);

      // If validation passes, you can proceed with success actions (e.g., form submission)
      Modal.success({
        title: 'Success',
        content: 'Your form has been successfully submitted!',
        onOk() {
          console.log('OK clicked');
          // Perform additional success actions here (e.g., navigate to another page)
        },
      });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Update the form with backend validation errors
        const errors = error.response.data.errors;

        // Convert backend errors to a format that Ant Design can handle
        const formErrors = Object.keys(errors).map((field) => ({
          name: field,
          errors: [errors[field]],
        }));

        // Set the validation errors on the form fields
        form.setFields(formErrors);
      } else {
        // Handle other errors (e.g., network error)
        message.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <PageContainer>
    <Card>
    <div className="Form">
      <header className="Form-header">
        <Form
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 24 }}
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
              <Select.Option value="agent">Agent</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
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
  );
}


export default NewUser;