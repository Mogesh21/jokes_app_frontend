import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Layout, Switch, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import './addSubCategory.scss';
import { UploadOutlined } from '@ant-design/icons';

const AddSubCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (values.cover_image) formData.append('image_file', values.cover_image.file);
      formData.append('cat_id', values.cat_id);
      formData.append('name', values.name);
      formData.append('color', values.color);
      formData.append('border_color', values.border_color);
      const response = await axiosInstance.post('/subcategories', formData);
      if (response.status === 201) {
        notification.success({
          message: 'Sub Category created successfully'
        });
        navigate('/app/dashboard/subcategories/subcategories-list');
      } else {
        throw new Error('Unable to create. Please try again');
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Error Occured....',
        description: 'Unable to create! Please try again...'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.status === 200) {
        const data = response.data.data || [];
        setCategories(data.filter((val) => val.has_subcategory === 1));
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unknown error occured', description: 'Please refresh the page' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const props = {
    height: '2rem',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png,.webp',
    maxCount: 1,
    beforeUpload: (file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      if (!isValidType) {
        message.error('You can only upload JPG, JPEG, PNG, or WEBP files!');
        setFileValid(false);
        return false;
      }
      setFileValid(true);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Add New Sub Category</p>
      <Form
        form={form}
        initialValues={{ color: '000000', border_color: '#000000' }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        style={{ margin: '1rem' }}
        layout="horizontal"
        onFinish={onFinish}
      >
        <Form.Item label="Select Category" name="cat_id" rules={[{ required: true, message: 'Please select the Category' }]}>
          <Select>
            {categories.map((category) => (
              <Select.Option value={category.id} key={category.id}>
                {category.name}
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

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1DCCDE' }} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default AddSubCategory;
