import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Layout, Switch, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { UploadOutlined } from '@ant-design/icons';

const AddCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (values.cover_image) formData.append('image_file', values.cover_image.file);
      formData.append('type_id', values.type_id);
      formData.append('name', values.name);
      formData.append('version', values.version);
      formData.append('color', values.color);
      formData.append('border_color', values.border_color);
      formData.append('has_subcategory', values.has_subcategory || false);
      const response = await axiosInstance.post('/categories', formData);
      if (response.status === 201) {
        notification.success({
          message: 'Category created successfully'
        });
        navigate('/app/dashboard/categories/categories-list');
      } else {
        throw new Error('Unable to create');
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 413) {
        notification.error({
          message: err.response?.data?.message || 'File size must be less than 1MB'
        });
      } else {
        notification.error({
          message: 'Error Occured....',
          description: 'Unable to create! Please try again...'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axiosInstance.get('/types');
      if (response.status === 200) {
        setTypes(response.data.data);
      }
    } catch (err) {
      notification.error({ message: 'Unknown error occured', description: 'Please refresh the page' });
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const props = {
    height: '2rem',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png,.webp',
    maxCount: 1,
    beforeUpload: (file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      if (file.size > 1 * 1024 * 1024) {
        notification.error({ message: 'Image must be less than 1MB' });
        form.setFieldsValue({ cover_image: undefined });
      } else if (!isValidType) {
        notification.error({ message: 'You can only upload JPG, JPEG, PNG, or WEBP files!' });
        return Upload.LIST_IGNORE;
      }
      setFileValid(true);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Add New Category</p>
      <Form
        form={form}
        initialValues={{ color: '000000', border_color: '#000000' }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        style={{ margin: '1rem' }}
        layout="horizontal"
        onFinish={onFinish}
      >
        <Form.Item label="Select Type" name="type_id" rules={[{ required: true, message: 'Please select the Type!' }]}>
          <Select>
            {types.map((type) => (
              <Select.Option key={type} value={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
        <Form.Item label="Cover Image" name="cover_image" rules={[{ required: true, message: 'Please upload image' }]}>
          <Upload {...props}>
            <Button className="uploadButton">
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Version"
          name="version"
          rules={[
            { required: true, message: 'Please enter the version!' },
            {
              validator: (_, value) => {
                if (!value || /^\d+\.\d+\.\d+$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Version must be in the format X.Y.Z (e.g., 1.0.0)'));
              }
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please select the color!' }]}>
          <div style={{ display: 'flex', gap: 5, paddingTop: '10px', alignItems: 'center' }}>
            <input type="color" />
          </div>
        </Form.Item>
        <Form.Item label="Border Color" name="border_color" rules={[{ required: true, message: 'Please select border color!' }]}>
          <div style={{ display: 'flex', gap: 5, paddingTop: '10px', alignItems: 'center' }}>
            <input type="color" />
          </div>
        </Form.Item>
        <Form.Item label="Has Subcategory" name="has_subcategory">
          <div style={{ display: 'flex', gap: 5, paddingTop: '10px', alignItems: 'center' }}>
            <Switch
              onChange={(value) => form.setFieldsValue({ has_subcategory: value })}
              checkedChildren={'Yes'}
              unCheckedChildren={'No'}
            />
          </div>
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

export default AddCategory;
