import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Layout, Switch } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const CreateType = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state) {
      form.setFieldsValue({
        name: state.name,
        conversation: state.conversation,
        joke: state.joke,
        joke_image: state.joke_image,
        text_answer: state.text_answer,
        image_answer: state.image_answer
      });
    } else {
      navigate('/app/dashboard/types/types-list');
    }
  }, [state]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/types/${state.id}`, values);
      if (response.status === 200) {
        notification.success({
          message: 'Type updated successfully'
        });
        navigate('/app/dashboard/types/types-list');
      } else {
        throw new Error('Unable to update');
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Error Occured....',
        description: 'Unable to update! Please try again...'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Create Type</p>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter the name!' },
            { max: 20, message: 'Name cannot be longer than 20 characters!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Conversation" name="conversation">
          <Switch className="mt-2" />
        </Form.Item>
        <Form.Item label="Joke Content" name="joke">
          <Switch className="mt-2" />
        </Form.Item>
        <Form.Item label="Joke Image" name="joke_image">
          <Switch className="mt-2" />
        </Form.Item>
        <Form.Item label="Text Answer" name="text_answer">
          <Switch className="mt-2" />
        </Form.Item>
        <Form.Item label="Image Answer" name="image_answer">
          <Switch className="mt-2" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1DCCDE' }} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default CreateType;
