import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const Asset = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/assets');
        setAssets(res.data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      }
    };
    fetchAssets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await axios.delete(`http://localhost:5000/api/assets/${id}`);
        setAssets(assets.filter(asset => asset.id !== id));
      } catch (error) {
        console.error('Failed to delete asset', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">อุปกรณ์ IT ทั้งหมด</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-slate-200 text-slate-800">
            <tr>
              <th className="py-3 px-4 text-left">IP Address</th>
              <th className="py-3 px-4 text-left">กอง</th>
              <th className="py-3 px-4 text-left">ได้มาจาก</th>
              <th className="py-3 px-4 text-left">ยี่ห้อ</th>
              <th className="py-3 px-4 text-left">รุ่น</th>
              <th className="py-3 px-4 text-left">ผู้ใช้</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {assets.map(asset => (
              <tr key={asset.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4">{asset.ipAddress?.ipAddress}</td>
                <td className="py-3 px-4">{asset.department?.name}</td>
                <td className="py-3 px-4">{asset.deviceType === 'อื่นๆ' ? asset.otherDeviceType : asset.deviceType}</td>
                <td className="py-3 px-4">{asset.brand}</td>
                <td className="py-3 px-4">{asset.model}</td>
                <td className="py-3 px-4">{asset.user ? `${asset.user.rank} ${asset.user.firstName} ${asset.user.lastName}` : 'N/A'}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <Link to={`/assets/${asset.id}`} className="text-sky-500 hover:text-sky-700">
                      <FiEye size={18} />
                    </Link>
                    <Link to={`/edit-asset/${asset.id}`} className="text-yellow-500 hover:text-yellow-700">
                      <FiEdit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(asset.id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Asset;