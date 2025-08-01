import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Image, Input, Switch, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const CategoriesList = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      const response = await axiosInstance.get('/types');
      setTypes(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Types', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(types.filter((type) => type.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredData(types);
    }
  }, [types, search]);

  const columns = [
    {
      title: 'Type Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Conversation',
      key: 'conversation',
      render: (_, record) => <Checkbox checked={record.conversation}></Checkbox>
    },
    {
      title: 'Joke',
      key: 'joke',
      render: (_, record) => <Checkbox checked={record.joke}></Checkbox>
    },
    {
      title: 'Joke Image',
      key: 'joke_image',
      render: (_, record) => <Checkbox checked={record.joke_image}></Checkbox>
    },
    {
      title: 'Text Answer',
      key: 'text_answer',
      render: (_, record) => <Checkbox checked={record.text_answer}></Checkbox>
    },
    {
      title: 'Image Answer',
      key: 'image_answer',
      render: (_, record) => <Checkbox checked={record.image_answer}></Checkbox>
    },
    {
      title: 'Options',
      key: 'options',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => handleEdit(record)} style={{ backgroundColor: '#1DCCDE' }}>
              Edit
            </Button>
            <Popconfirm
              title="Delete the type"
              description="Are you sure to delete this type?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const handleEdit = (record) => {
    navigate('/app/dashboard/types/edit-type', { state: record });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/types/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'Type deleted sucessfully' });
        fetchTypes();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  return (
    <div className="types-page">
      <div className="search-container">
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>
    </div>
  );
};

export default CategoriesList;
