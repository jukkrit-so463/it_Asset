import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronDown, FiChevronUp, FiHome, FiUsers } from 'react-icons/fi';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDepartmentId, setOpenDepartmentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, divisionsRes, assetsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/departments'),
          axios.get('http://localhost:5000/api/divisions'),
          axios.get('http://localhost:5000/api/assets'),
        ]);
        setDepartments(departmentsRes.data);
        setDivisions(divisionsRes.data);
        setAssets(assetsRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAssetCount = (type, id) => {
    if (type === 'department') {
      return assets.filter(asset => asset.departmentId === id).length;
    }
    if (type === 'division') {
      return assets.filter(asset => asset.divisionId === id).length;
    }
    return 0;
  };

  const toggleDepartment = (id) => {
    setOpenDepartmentId(openDepartmentId === id ? null : id);
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">กอง & แผนก</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map(dep => {
          const divisionsInDep = divisions.filter(div => div.departmentId === dep.id);
          const departmentAssetCount = getAssetCount('department', dep.id);
          const isOpen = openDepartmentId === dep.id;

          return (
            <div key={dep.id} className="bg-white rounded-lg shadow-md transition-all duration-300">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                onClick={() => toggleDepartment(dep.id)}
              >
                <div className="flex items-center">
                  <FiHome className="w-6 h-6 mr-3 text-sky-500" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-700">{dep.name}</h2>
                    <p className="text-sm text-slate-500">{departmentAssetCount} อุปกรณ์</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-slate-500 mr-4">{divisionsInDep.length} แผนก</span>
                  {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>
              
              {isOpen && (
                <div className="border-t border-slate-200 p-4 bg-slate-50/50">
                  {divisionsInDep.length > 0 ? (
                    <ul className="space-y-3 ml-4">
                      {divisionsInDep.map(div => {
                        const divisionAssetCount = getAssetCount('division', div.id);
                        return (
                          <li key={div.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-100">
                            <div className="flex items-center">
                              <FiUsers className="w-5 h-5 mr-3 text-slate-500" />
                              <span className="text-slate-700">{div.name}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-600">{divisionAssetCount} อุปกรณ์</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-center text-slate-500 py-4">ไม่มีแผนกใด ในกองนี้</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Departments;
