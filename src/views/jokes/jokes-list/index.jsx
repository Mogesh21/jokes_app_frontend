import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Input, Select } from 'antd';
import './joke.scss';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const JokesList = () => {
  const navigate = useNavigate();
  const [jokes, setJokes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data.data.reverse());
    } catch (err) {
      notification.error({ message: 'Unable to get Categories', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

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
    fetchCategories();
    fetchJokes();
    const storedPagination = JSON.parse(localStorage.getItem('jokesPagination'));
    const storedSearch = localStorage.getItem('jokesSearch');
    if (storedPagination) {
      const maxPage = Math.ceil(jokes.length / (storedPagination.pageSize || 10));
      if (storedPagination.current > maxPage && maxPage > 0) {
        setPagination({ ...storedPagination, current: 1 });
      } else {
        setPagination(storedPagination);
      }
    }
    if (storedSearch) {
      setSearch(storedSearch);
    }
  }, []);

  useEffect(() => {
    let newData = jokes;
    if (currentCategory) {
      newData = newData.filter((joke) => joke.cat_id === currentCategory);
    }
    if (search) {
      newData = newData.filter(
        (joke) =>
          joke.subcat_name?.toLowerCase().includes(search.toLowerCase()) || joke.content.joke?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredData(newData);
  }, [jokes, search, currentCategory]);

  useEffect(() => {
    localStorage.setItem('jokesPagination', JSON.stringify(pagination));
    localStorage.setItem('jokesSearch', search);
  }, [pagination, search]);

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
      dataIndex: 'subcat_name',
      sorter: (a, b) => {
        return a.subcat_name.localeCompare(b.subcat_name);
      }
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
      <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Select
          value={currentCategory}
          onChange={(value) => setCurrentCategory(value)}
          placeholder="Select Category"
          style={{ width: 200 }}
        >
          <Select.Option key={null} value="" />
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
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
