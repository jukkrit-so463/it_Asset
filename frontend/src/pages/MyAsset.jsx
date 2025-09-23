import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../App';
import AddMyDeviceModal from '../components/AddMyDeviceModal';

const MyAsset = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchMyAssets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/assets', config);
      setAssets(response.data);
    } catch (err) {
      setError('Failed to fetch your asset details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssets();
  }, [user]);

  const handleAssetAdded = (newAsset) => {
    setAssets(prevAssets => [...prevAssets, newAsset]);
    fetchMyAssets(); // Refetch to ensure data is up to date
  };

  if (loading) {
    return <div className="text-center p-8">Loading your asset details...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">My Assigned Assets</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Add Device
        </button>
      </div>

      {isModalOpen && <AddMyDeviceModal onClose={() => setIsModalOpen(false)} onAssetAdded={handleAssetAdded} />}

      {assets.length === 0 ? (
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
            You do not have any assets assigned.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
};

const AssetCard = ({ asset }) => (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-slate-800 text-white p-6">
            <h2 className="text-2xl font-bold">{asset.brand} {asset.model}</h2>
            <p className="text-slate-300 mt-1">{asset.deviceType}</p>
        </div>

        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Device Details</h3>
                    <DetailItem label="IP Address" value={asset.ipAddress?.ipAddress} />
                    <DetailItem label="Service Tag / S/N" value={asset.serviceTag} />
                    <DetailItem label="MAC Address" value={asset.macAddress} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Assignment Details</h3>
                    <DetailItem label="Department" value={asset.department?.name} />
                    <DetailItem label="Division" value={asset.division?.name} />
                    <DetailItem label="Date Received" value={new Date(asset.dateReceived).toLocaleDateString()} />
                    <DetailItem label="Status" value={asset.status} badgeColor={asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Notes</h3>
                <p className="mt-2 text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-md">
                    {asset.notes || 'No notes for this device.'}
                </p>
            </div>
        </div>
    </div>
);

const DetailItem = ({ label, value, badgeColor }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {badgeColor ? (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeColor}`}>
                {value}
            </span>
        ) : (
            <p className="text-sm text-slate-800 font-semibold">{value || 'N/A'}</p>
        )}
    </div>
);

export default MyAsset;