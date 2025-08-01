import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Layout, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import './addJoke.scss';
import DeleteIcon from '../../../assets/images/delete.svg';
import AddIcon from '../../../assets/images/add.svg';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const AddJoke = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [conversation, setConversation] = useState(['']);
  const [currentCategory, setCurrentCategory] = useState({});
  const [jokeImage, setJokeImage] = useState(null);
  const [imageAnswer, setImageAnswer] = useState(null);
  const [speakerImage, setSpeakerImage] = useState(null);
  const [receiverImage, setReceiverImage] = useState(null);
  const catId = Form.useWatch('cat_id', form);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (catId) {
      setConversation(['']);
      setJokeImage(null);
      setImageAnswer(null);
      setSpeakerImage(null);
      setReceiverImage(null);
      form.resetFields();
      form.setFieldValue('cat_id', catId);
    }
  }, [catId]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unknown error occurred', description: 'Please refresh the page' });
    }
  };

  const fetchSubcategoriesByCatId = async (cat_id) => {
    try {
      const response = await axiosInstance.get(`/subcategories/catid/${cat_id}`);
      if (response.status === 200) {
        setSubCategories(response.data.data);
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unknown error occurred', description: 'Please refresh the page' });
    }
  };

  const onCategoryChange = (value) => {
    form.setFieldsValue({ cat_id: value, subcat_id: null });
    fetchSubcategoriesByCatId(value);
    const selectedCategory = categories.find((cat) => cat.id === value);
    setCurrentCategory(selectedCategory || {});
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cat_id', values.cat_id);
      if (values.subcat_id) formData.append('subcat_id', values.subcat_id);
      if (jokeImage && jokeImage.length > 0) formData.append('joke_image', jokeImage[0].originFileObj);
      if (speakerImage && speakerImage.length > 0) formData.append('speaker_image', speakerImage[0].originFileObj);
      if (receiverImage && receiverImage.length > 0) formData.append('receiver_image', receiverImage[0].originFileObj);
      if (imageAnswer && imageAnswer.length > 0) formData.append('image_answer', imageAnswer[0].originFileObj);
      if (conversation && conversation.length > 0 && conversation[0]) values.content.conversation = conversation;
      formData.append('content', JSON.stringify(values.content));
      const response = await axiosInstance.post('/jokes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        notification.success({ message: 'Joke added successfully' });
        navigate('/app/dashboard/jokes/jokes-list');
      } else {
        notification.error({ message: response.data?.message });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unable to add joke.Please refresh the page' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeConversation = (index, value) => {
    setConversation((prev) => prev.map((convo, idx) => (idx === index ? value : convo)));
  };

  const handleDeleteConversation = (index) => {
    setConversation((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddConversation = (index) => {
    setConversation((prev) => [...prev.slice(0, index + 1), '', ...prev.slice(index + 1)]);
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
      const isValidType = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      if (!isValidType) {
        message.error('Only JPG, PNG, or WEBP files allowed!');
        return Upload.LIST_IGNORE;
      }
      return true;
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px', padding: '1rem' }}>
      <p className="form-title">Add New Joke</p>

      <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} form={form} onFinish={onFinish}>
        <Form.Item label="Select Category" name="cat_id" rules={[{ required: true, message: 'Category is required' }]}>
          <Select onChange={onCategoryChange} placeholder="Choose category">
            {categories.map((category) => (
              <Select.Option value={category.id} key={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {subcategories.length > 0 && (
          <Form.Item label="Select Sub Category" name="subcat_id" rules={[{ required: true, message: 'Sub Category is required' }]}>
            <Select placeholder="Choose subcategory">
              {subcategories.map((subcategory) => (
                <Select.Option value={subcategory.id} key={subcategory.id}>
                  {subcategory.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {currentCategory.conversation === 1 && (
          <>
            <Form.Item label="Speaker Name" name={['content', 'speaker']} rules={[{ required: true, message: 'Speaker Name is required' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Receiver Name"
              name={['content', 'receiver']}
              rules={[{ required: true, message: 'Receiver Name is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Speaker Image"
              name="speakerImage"
              rules={[
                {
                  required: true,
                  message: 'Speaker Image is required'
                }
              ]}
            >
              <Upload
                {...uploadProps}
                onChange={({ fileList }) => {
                  setSpeakerImage(fileList);
                  form.setFieldValue('speakerImage', fileList);
                }}
                fileList={speakerImage}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Receiver Image"
              name="receiverImage"
              rules={[
                {
                  required: true,
                  message: 'Receiver Image is required'
                }
              ]}
            >
              <Upload
                {...uploadProps}
                onChange={({ fileList }) => {
                  setReceiverImage(fileList);
                  form.setFieldValue('receiverImage', fileList);
                }}
                fileList={receiverImage}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Conversation">
              <div className="conversation-container">
                {conversation.map((value, index) => (
                  <div key={index} className="conversation">
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {index % 2 === 0
                          ? form.getFieldValue(['content', 'speaker'])
                            ? form.getFieldValue(['content', 'speaker']) + ':'
                            : ''
                          : form.getFieldValue(['content', 'receiver'])
                            ? form.getFieldValue(['content', 'receiver']) + ':'
                            : ''}
                      </span>
                      <TextArea rows={2} value={value} onChange={(e) => handleChangeConversation(index, e.target.value)} />
                    </div>
                    {conversation.length > 1 && (
                      <Button
                        danger
                        onClick={() => handleDeleteConversation(index)}
                        icon={<img src={DeleteIcon} alt="delete" style={{ width: '1.2rem' }} />}
                      />
                    )}
                    <Button
                      onClick={() => handleAddConversation(index)}
                      icon={<img src={AddIcon} alt="add" style={{ width: '1.2rem' }} />}
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
          </>
        )}

        {currentCategory.joke === 1 && (
          <Form.Item label="Joke Content/Question" name={['content', 'joke']} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}

        {currentCategory.joke_image === 1 && (
          <Form.Item
            label="Joke/Content Image"
            name="joke_image"
            rules={[
              {
                required: true,
                message: 'Joke Image is required'
              }
            ]}
          >
            <Upload
              {...uploadProps}
              onChange={({ fileList }) => {
                setJokeImage(fileList);
                form.setFieldValue('jokeImage', fileList);
              }}
              fileList={jokeImage}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        )}

        {currentCategory.text_answer === 1 && (
          <Form.Item label="Text Answer" name={['content', 'text_answer']} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}

        {currentCategory.image_answer === 1 && (
          <Form.Item label="Image Answer" name="imageAnswer" rules={[{ required: true, message: 'Answer Image is required' }]}>
            <Upload
              {...uploadProps}
              onChange={({ fileList }) => {
                setImageAnswer(fileList);
                form.setFieldValue('imageAnswer', fileList);
              }}
              fileList={imageAnswer}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ offset: 6, span: 16 }} shouldUpdate>
          {() =>
            form.getFieldValue('cat_id') ? (
              <div style={{ gridColumn: 'span 2' }}>
                <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#1DCCDE' }}>
                  Submit
                </Button>
              </div>
            ) : null
          }
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default AddJoke;
