import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Image, Input, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import { index } from 'd3';

const AppsList = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const fetchApps = async () => {
    try {
      const response = await axiosInstance.get('/apps');
      console.log(response.data.data);
      setApps(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Apps', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(apps.filter((App) => App.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredData(apps);
    }
  }, [apps, search]);

  const columns = [
    {
      title: 'SNO',
      key: 'sno',
      render: (_, __, index) => {
        const currentPage = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        const sno = (currentPage - 1) * pageSize + index + 1;
        return <div style={{ width: 'max-content', whiteSpace: 'nowrap' }}>{sno}</div>;
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      render: (_, record) => <span>{typeof record.categories === 'object' ? record?.categories?.join(',') : '' || ''}</span>
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
              title="Delete the App"
              description="Are you sure to delete this App?"
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
    navigate('/app/dashboard/apps/edit-app', { state: record });
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/apps/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'App deleted sucessfully' });
        fetchApps();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  return (
    <div className="apps-page">
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

export default AppsList;
