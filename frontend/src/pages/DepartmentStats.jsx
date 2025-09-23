import { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentStats = () => {
  const [departmentStats, setDepartmentStats] = useState({});
  const [divisionStats, setDivisionStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get('/api/assets');
        const assets = res.data;
        
        // Process stats for departments
        const deptStats = assets.reduce((acc, asset) => {
          const deptName = asset.department?.name || 'N/A';
          if (!acc[deptName]) {
            acc[deptName] = {};
          }
          const deviceType = asset.deviceType;
          acc[deptName][deviceType] = (acc[deptName][deviceType] || 0) + 1;
          return acc;
        }, {});
        setDepartmentStats(deptStats);

        // Process stats for divisions
        const divStats = assets.reduce((acc, asset) => {
          const divName = asset.division?.name || 'N/A';
          if (!acc[divName]) {
            acc[divName] = {};
          }
          const deviceType = asset.deviceType;
          acc[divName][deviceType] = (acc[divName][deviceType] || 0) + 1;
          return acc;
        }, {});
        setDivisionStats(divStats);

      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Asset Statistics</h1>

      {/* Department Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">By Department</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(departmentStats).map(([deptName, stats]) => (
            <div key={deptName} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3 text-slate-800">{deptName}</h3>
              <ul className="space-y-2">
                {Object.entries(stats).map(([device, count]) => (
                  <li key={device} className="flex justify-between items-center text-slate-600">
                    <span>{device}</span>
                    <span className="font-semibold bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-sm">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Division Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">By Division</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(divisionStats).map(([divName, stats]) => (
            <div key={divName} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3 text-slate-800">{divName}</h3>
              <ul className="space-y-2">
                {Object.entries(stats).map(([device, count]) => (
                  <li key={device} className="flex justify-between items-center text-slate-600">
                    <span>{device}</span>
                    <span className="font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;