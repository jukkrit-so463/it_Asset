import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AssetDetail = () => {
  const [asset, setAsset] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsset = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(`http://localhost:5000/api/assets/${id}`, config);
      setAsset(res.data);
    };
    fetchAsset();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/assets/${id}`, config);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete asset', error);
        alert('Failed to delete asset. Please try again.');
      }
    }
  };

  if (!asset) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">รายละเอียด</h1>
          <button onClick={() => navigate(-1)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg transition-colors">
            กลับ
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Grouping Section */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">ข้อมูล IP/สถานที่</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div><strong className="text-slate-500">IP Address:</strong> <span className="text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded-md">{asset.ipAddress?.ipAddress || 'N/A'}</span></div>
              <div><strong className="text-slate-500">กอง:</strong> <span className="text-slate-900">{asset.department?.name || 'N/A'}</span></div>
              <div><strong className="text-slate-500">แผนก:</strong> <span className="text-slate-900">{asset.division?.name || 'N/A'}</span></div>
            </div>
          </div>

          {/* Device Info Section */}
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">ข้อมูล อุปกรณ์</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div><strong className="text-slate-500">ประเภท อุปกรณ์:</strong> <span className="text-slate-900">{asset.deviceType}</span></div>
              <div><strong className="text-slate-500">ยี่ห้อ:</strong> <span className="text-slate-900">{asset.brand || 'N/A'}</span></div>
              <div><strong className="text-slate-500">รุ่น:</strong> <span className="text-slate-900">{asset.model || 'N/A'}</span></div>
              <div><strong className="text-slate-500">Service Tag:</strong> <span className="text-slate-900">{asset.serviceTag || 'N/A'}</span></div>
              <div><strong className="text-slate-500">MAC Address:</strong> <span className="text-slate-900">{asset.macAddress || 'N/A'}</span></div>
              <div><strong className="text-slate-500">วันที่ได้รับ:</strong> <span className="text-slate-900">{new Date(asset.dateReceived).toLocaleDateString()}</span></div>
              <div><strong className="text-slate-500">สถานะ:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{asset.status}</span></div>
              {asset.colorSticker && <div><strong className="text-slate-500">Color Sticker:</strong> <span className="text-slate-900">{asset.colorSticker}</span></div>}
              {asset.snMonitor && <div><strong className="text-slate-500">S/N Monitor:</strong> <span className="text-slate-900">{asset.snMonitor}</span></div>}
              {asset.snUps && <div><strong className="text-slate-500">S/N UPS:</strong> <span className="text-slate-900">{asset.snUps}</span></div>}
              <div className="sm:col-span-2"><strong className="text-slate-500">หมายเหตุ:</strong> <span className="text-slate-900 whitespace-pre-wrap">{asset.notes || 'N/A'}</span></div>
            </div>
          </div>

          {/* User Info Section */}
          {asset.user && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-700 mb-4">ข้อมูลผู้ครอบครอง</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div><strong className="text-slate-500">ชื่อ:</strong> <span className="text-slate-900">{asset.user.rank} {asset.user.firstName} {asset.user.lastName}</span></div>
                <div><strong className="text-slate-500">Username:</strong> <span className="text-slate-900">{asset.user.username}</span></div>
                <div><strong className="text-slate-500">เบอร์โทร:</strong> <span className="text-slate-900">{asset.user.contactNumber || 'N/A'}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <Link to={`/edit-asset/${id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            แก้ไข
          </Link>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
            ลบข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;