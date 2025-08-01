import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Image, Input, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const CategoriesList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        categories.filter(
          (category) =>
            category.name.toLowerCase().includes(search.toLowerCase()) || category.version.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredData(categories);
    }
  }, [categories, search]);

  const columns = [
    {
      title: 'Type Id',
      dataIndex: 'type_id',
      key: 'type_id',
      render: (_, record) => <div style={{ width: 'max-content', textWrap: 'nowrap' }}>{record.type_id}</div>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Color',
      key: 'color',
      render: (_, record) => <input type="color" disabled value={record.color} />
    },
    {
      title: 'Border Color',
      key: 'color',
      render: (_, record) => <input type="color" disabled value={record.border_color} />
    },
    {
      title: 'Cover Image',
      key: 'cover_image',
      render: (_, record) => <Image src={record.cover_image} style={{ aspectRatio: 1 / 1, maxHeight: 60 }} />
    },
    {
      title: 'Has Subcategory',
      dataIndex: 'has_subcategory',
      key: 'has_subcategory',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Switch disabled value={record.has_subcategory} />
        </div>
      )
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version'
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
              title="Delete the Category"
              description="Are you sure to delete this Category?"
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
    navigate('/app/dashboard/categories/edit-category', { state: { record } });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/categories/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'Category deleted sucessfully' });
        fetchCategories();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  return (
    <div className="categories-page">
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
