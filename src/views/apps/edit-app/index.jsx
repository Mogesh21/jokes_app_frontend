import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const EditApp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (state) {
      form.setFieldsValue({
        name: state.name,
        categories: state.categories
      });
    } else {
      navigate('/app/dashboard/apps/apps-list');
    }
  }, [state]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/apps/${state.id}`, values);
      if (response.status === 200) {
        notification.success({
          message: 'App updated successfully'
        });
        navigate('/app/dashboard/apps/apps-list');
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

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (err) {
      notification.error({ message: 'Unknown error occured', description: 'Please refresh the page' });
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Edit App</p>
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
        <Form.Item label="Select Cetegories" name="categories" rules={[{ required: true, message: 'Please select the Categories!' }]}>
          <Select
            mode="multiple"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {categories.map((category) => (
              <Select.Option value={category.id}>{category.name}</Select.Option>
            ))}
          </Select>
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

export default EditApp;
