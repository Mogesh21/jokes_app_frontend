import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, notification, Layout, Upload, message, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import './addJoke.scss';
import DeleteIcon from '../../../assets/images/delete.svg';
import AddIcon from '../../../assets/images/add.svg';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import readXlsxFile from 'read-excel-file';

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
  const [fileUpload, setFileUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [data, setData] = useState([]);
  // const [errors, setErrors] = useState({
  //   cat_id: false,
  //   question: false,
  //   answer: false
  // });

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
      setExcelFile(null);
      form.resetFields();
      form.setFieldValue('cat_id', catId);
      form.setFieldsValue({ subcat_id: null });
      fetchSubcategoriesByCatId(catId);
      const selectedCategory = categories.find((cat) => cat.id === catId);
      setCurrentCategory(selectedCategory || {});
      form.validateFields(['cat_id']);
    }
  }, [catId]);

  useEffect(() => {
    form.validateFields(['cat_id']);
  }, [fileUpload]);

  useEffect(() => {
    if (excelFile) {
      handleExcelFileChange();
    }
  }, [excelFile]);

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
      console.error(err);
      notification.error({ message: 'Unknown error occurred', description: 'Please refresh the page' });
    }
  };

  // const onCategoryChange = (value) => {
  //   form.setFieldsValue({ subcat_id: null });
  //   fetchSubcategoriesByCatId(value);
  //   const selectedCategory = categories.find((cat) => cat.id === value);
  //   setCurrentCategory(selectedCategory || {});
  // };

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
      console.error(err);
      if (err.response.status === 413) {
        notification.error({
          message: err.response?.data?.message || 'File size must be less than 1MB'
        });
      } else {
        notification.error({ message: 'Unable to add joke.Please refresh the page' });
      }
    } finally {
      setLoading(false);
    }
  };

  const addMultipleJokes = async () => {
    setLoading(true);
    console.log(excelFile);
    if (excelFile === null || excelFile.length === 0) {
      notification.error({ message: 'Please upload excel file ' });
      setLoading(false);
      return;
    } else if (data.length === 0) {
      notification.warning({ message: 'Invalid data or file' });
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.post('/jokes/multiple', data);
      if (response.status === 200) {
        notification.success({ message: 'Jokes added successfully' });
        navigate('/app/dashboard/jokes/jokes-list');
      } else {
        notification.error({ message: response.data?.message });
      }
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Unable to add jokes.Please try again' });
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

  const handleExcelFileChange = async () => {
    if (excelFile && excelFile[0] && excelFile[0].originFileObj) {
      const file = excelFile[0].originFileObj;
      const data = await readXlsxFile(file);

      const headers = data[0];
      const result = [];

      const colIndexes = {};
      headers.forEach((h, idx) => {
        colIndexes[h] = idx;
      });

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const record = {
          cat_id: currentCategory.id
        };

        if (currentCategory.has_subcategory === 1) {
          if (colIndexes.subcat_id === undefined) {
            notification.error({ message: 'Subcategory is required for this category' });
            return;
          } else {
            record.subcat_id = row[colIndexes.subcat_id] ?? null;
          }
        }

        const content = {};
        Object.keys(currentCategory).forEach((field) => {
          if (typeof currentCategory[field] === 'number' && currentCategory[field] === 1 && colIndexes[field] !== undefined) {
            content[field] = row[colIndexes[field]];
          }
        });

        record.content = content;
        if (Object.keys(content).length > 0) result.push(record);
      }
      setData(result);
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
      const isValidType = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      if (!isValidType) {
        message.error('Only JPG, PNG, or WEBP files allowed!');
        return Upload.LIST_IGNORE;
      }
      return true;
    }
  };

  const excelProps = {
    accept: '.xls,.xlsx',
    maxCount: 1,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess('ok');
      }, 0);
    },
    beforeUpload: () => false,
    onChange: ({ fileList }) => {
      setExcelFile(fileList);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px', padding: '1rem' }}>
      <p className="form-title">Add Jokes</p>

      <Form
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        form={form}
        onFinish={fileUpload ? addMultipleJokes : onFinish}
      >
        <Form.Item label="Type">
          <Radio.Group value={fileUpload} onChange={(e) => setFileUpload(e.target.value)} style={{ marginTop: '10px' }}>
            <Radio value={false}>Add Data</Radio>
            <Radio value={true}>File Upload</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Select Category"
          name="cat_id"
          dependencies={['cat_id', 'fileUpload']}
          rules={[
            { required: true, message: 'Category is required' },
            () => ({
              validator(_, value) {
                if (!value) return Promise.resolve();

                const category = categories.find((c) => c.id === value);
                if (!category) return Promise.resolve();

                const isBlocked = fileUpload && (category.conversation === 1 || category.image_answer === 1 || category.joke_image === 1);
                console.log(isBlocked);
                return isBlocked ? Promise.reject(new Error('This category is not supported')) : Promise.resolve();
              }
            })
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option?.children?.toString().toLowerCase().includes(input.toLowerCase())}
            placeholder="Choose category"
          >
            {categories.map((category) => (
              <Select.Option value={category.id} key={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {fileUpload ? (
          <Form.Item
            label="Upload Excel File"
            rules={[
              {
                required: true,
                message: 'Excel file is required'
              }
            ]}
          >
            <Upload {...excelProps} fileList={excelFile}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        ) : (
          <>
            {subcategories.length > 0 && (
              <Form.Item label="Select Sub Category" name="subcat_id" rules={[{ required: true, message: 'Sub Category is required' }]}>
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
                  placeholder="Choose subcategory"
                >
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
                <Form.Item
                  label="Speaker Name"
                  name={['content', 'speaker']}
                  rules={[{ required: true, message: 'Speaker Name is required' }]}
                >
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
          </>
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
