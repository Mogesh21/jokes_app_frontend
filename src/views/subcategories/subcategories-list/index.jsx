import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Image, Input } from 'antd';
import './SubCategory.scss';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const SubCategoriesList = () => {
  const navigate = useNavigate();
  const [subcategories, setSubCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get('/subcategories');
      setSubCategories(response.data.data.reverse());
    } catch (err) {
      notification.error({ message: 'Unable to get Sub Categories', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        subcategories.filter(
          (subcategory) =>
            subcategory.name.toLowerCase().includes(search.toLowerCase()) ||
            subcategory.cat_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredData(subcategories);
    }
  }, [subcategories, search]);

  const columns = [
    {
      title: 'Subcategory Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Category Name',
      dataIndex: 'cat_name',
      render: (_, record) => <div style={{ width: 'max-content', textWrap: 'nowrap' }}>{record.cat_name}</div>
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
    navigate('/app/dashboard/subcategories/edit-subcategory', { state: { record } });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/subcategories/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'Sub Category removed sucessfully' });
        fetchSubCategories();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  return (
    <div className="subcategories-page">
      <div className="search-container">
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>
    </div>
  );
};

export default SubCategoriesList;
