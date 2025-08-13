import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Input } from 'antd';
import './joke.scss';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const JokesList = () => {
  const navigate = useNavigate();
  const [jokes, setJokes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const fetchJokes = async () => {
    try {
      const response = await axiosInstance.get('/jokes');
      setJokes(response.data.data.reverse());
    } catch (err) {
      notification.error({ message: 'Unable to get Jokes', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        jokes.filter(
          (joke) =>
            joke.cat_name.toLowerCase().includes(search.toLowerCase()) ||
            joke.subcat_name?.toLowerCase().includes(search.toLowerCase()) ||
            joke.content.joke?.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredData(jokes);
    }
  }, [jokes, search]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => b.id - a.id
    },
    {
      title: 'Category Name',
      dataIndex: 'cat_name'
    },
    {
      title: 'Sub Category Name',
      dataIndex: 'subcat_name'
    },
    {
      title: 'Content',
      dataIndex: 'content',
      render: (_, record) =>
        record.content.joke ? (
          <span>{record.content?.joke ?? ''}</span>
        ) : (
          <span>{(record.content?.speaker ?? '') + ',' + (record.content?.receiver ?? '')}</span>
        )
    },
    {
      title: 'Options',
      key: 'options',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => handleEdit(record)} style={{ backgroundColor: '#1DCCDE' }}>
              Edit
            </Button>
            <Popconfirm
              title="Delete the Sub Category"
              description="Are you sure to delete this Sub Category?"
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
    const data = jokes.find((joke) => joke.id === record.id);
    navigate('/app/dashboard/jokes/edit-joke', { state: data });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/jokes/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'Joke removed sucessfully' });
        fetchJokes();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.error(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  return (
    <div className="jokes-page">
      <div className="search-container">
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="container">
        <Table
          style={{ width: '100%', overflow: 'auto' }}
          columns={columns}
          loading={tableLoading}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            ...pagination,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            }
          }}
        />
      </div>
    </div>
  );
};

export default JokesList;
