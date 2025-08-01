import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Layout, Switch, Upload, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { UploadOutlined } from '@ant-design/icons';

const EditCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const location = useLocation();
  const { state } = location;
  const [fileList, setFileList] = useState([]);

  // Fetch category types
  const fetchTypes = async () => {
    try {
      const response = await axiosInstance.get('/types');
      if (response.status === 200) {
        setTypes(response.data.data);
      }
    } catch (err) {
      notification.error({
        message: 'Unknown error occurred',
        description: 'Please refresh the page'
      });
    }
  };

  useEffect(() => {
    fetchTypes();

    if (state?.record) {
      form.setFieldsValue({
        type_id: state.record.type_id,
        name: state.record.name,
        color: state.record.color,
        border_color: state.record.border_color,
        version: state.record.version,
        has_subcategory: state.record.has_subcategory
      });

      if (state.record.cover_image) {
        setFileList([
          {
            uid: '-1',
            name: 'Cover Image',
            status: 'done',
            url: state.record.cover_image,
            thumbUrl: state.record.cover_image
          }
        ]);
      }
    }
  }, [state, form]);

  // Submit updated category
  const onFinish = async (values) => {
    setLoading(true)
    values.cover_image = state.record.cover_image;

    try {
      const formData = new FormData();

      if (fileList.length > 0) {
        formData.append('image_file', fileList[0].originFileObj);
      }
      formData.append('cover_image', values.cover_image);
      formData.append('type_id', values.type_id);
      formData.append('name', values.name);
      formData.append('version', values.version);
      formData.append('color', values.color);
      formData.append('border_color', values.border_color);
      formData.append('has_subcategory', values.has_subcategory || false);

      const response = await axiosInstance.put(`/categories/${state.record.id}`, formData);

      if (response.status === 200) {
        notification.success({
          message: 'Category updated successfully'
        });
        navigate('/app/dashboard/categories/categories-list');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error occurred',
        description: 'Unable to update category. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    listType: 'picture',
    accept: '.jpg,.jpeg,.png,.webp',
    maxCount: 1,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess('ok');
      }, 0);
    },
    beforeUpload: (file) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      if (!isValidType) {
        message.error('You can only upload JPG, PNG, or WEBP files!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: ({ fileList }) => setFileList(fileList),
    fileList
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Edit Category</p>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item label="Select Type" name="type_id" rules={[{ required: true, message: 'Please select the Type!' }]}>
          <Select>
            {types.map((type) => (
              <Select.Option key={type.id} value={type.id}>
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

        <Form.Item
          label="Cover Image"
          name="cover_image"
          rules={[
            {
              validator: async () => {
                if (fileList.length === 0) {
                  return Promise.reject(new Error('Cover image is required'));
                }
              }
            }
          ]}
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload {...uploadProps}>
            <Button className="uploadButton" icon={<UploadOutlined />}>
              Upload
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Version"
          name="version"
          rules={[
            { required: true, message: 'Please enter the version!' },
            {
              validator: (_, value) =>
                !value || /^\d+\.\d+\.\d+$/.test(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error('Version must be in the format X.Y.Z (e.g., 1.0.0)'))
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please select the color!' }]}>
          <Input type="color" style={{ width: '5rem' }} />
        </Form.Item>

        <Form.Item label="Border Color" name="border_color" rules={[{ required: true, message: 'Please select border color!' }]}>
          <Input type="color" style={{ width: '5rem' }} />
        </Form.Item>

        <Form.Item label="Has Subcategory" name="has_subcategory" valuePropName="checked">
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#1DCCDE' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default EditCategory;
