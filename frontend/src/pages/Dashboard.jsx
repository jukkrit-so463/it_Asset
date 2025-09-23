import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiGrid, FiList, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AddAssetModal from '../components/AddAssetModal';

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm flex items-center justify-between border-l-4 ${color}`}>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        {icon}
    </div>
);

const ipToNumber = (ip) => {
  if (!ip) return 0;
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [ips, setIps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [totalIpCount, setTotalIpCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (ip = null) => {
    setModalInitialData({
      ipAddressId: ip ? ip.id : '',
      departmentId: selectedDepartment,
      divisionId: selectedDivision,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalInitialData(null);
  };

  const fetchData = useCallback(async () => {
    try {
      const [ipsRes, departmentsRes, divisionsRes] = await Promise.all([
        axios.get('/api/ips?status=all'),
        axios.get('/api/departments'),
        axios.get('/api/divisions')
      ]);
      setIps(ipsRes.data);
      setTotalIpCount(ipsRes.data.length);
      setDepartments(departmentsRes.data);
      setDivisions(divisionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssetAdded = (newAsset) => {
    setIps(prevIps => 
      prevIps.map(ip => 
        ip.id === newAsset.ipAddressId 
        ? { ...ip, status: 'Assigned', device: newAsset } 
        : ip
      )
    );
  };

  const assignedIps = ips.filter(ip => ip.status === 'Assigned').length;
  const stats = {
    total: totalIpCount,
    assigned: assignedIps,
    available: totalIpCount - assignedIps,
  };
  const filteredDivisions = selectedDepartment 
    ? divisions.filter(d => d.departmentId === selectedDepartment)
    : [];

  const selectedDep = departments.find(d => d.id === selectedDepartment);
  const ipRanges = selectedDep?.specialIpRanges
    ? selectedDep.specialIpRanges.split(',').map(rangeStr => {
        const [min, max] = rangeStr.split('-').map(s => s.trim());
        return { min, max: max || min }; // Handle single IP ranges
      })
    : undefined;
  const numericRanges = ipRanges?.map(range => ({
      min: ipToNumber(range.min),
      max: ipToNumber(range.max)
  }));
  const isSpecialDepartment = numericRanges !== undefined;

  const availableIpsForModal = (() => {
    const availableIps = ips.filter(ip => ip.status === 'Available');
    if (selectedDepartment && isSpecialDepartment) {
      return availableIps.filter(ip => {
        const ipNum = ipToNumber(ip.ipAddress);
        return numericRanges.some(range => ipNum >= range.min && ipNum <= range.max);
      });
    }
    return availableIps;
  })();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">ยินดีต้อนรับ, Admin!</p>
        </div>
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            <FiPlus className="mr-2 -ml-1" />
            เพิ่มข้อมูล
          </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="IP Addresses ทั้งหมด" value={stats.total} icon={<FiGrid className="w-8 h-8 text-sky-400" />} color="border-sky-400" />
        <StatCard title="ถูกใช้งาน" value={stats.assigned} icon={<FiList className="w-8 h-8 text-red-400" />} color="border-red-400" />
        <StatCard title="IP Addresses เหลือ" value={stats.available} icon={<FiList className="w-8 h-8 text-green-400" />} color="border-green-400" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
            <h2 className="text-lg font-semibold text-slate-700">กรองข้อมูล</h2>
            {filtersVisible ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {filtersVisible && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">ค้นหา IP Address</label>
                <input 
                  type="text" 
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
                />
            </div>
            <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">กอง</label>
                <select 
                id="department" 
                value={selectedDepartment}
                onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedDivision('');
                }} 
                className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
                >
                <option value="">ทั้งหมด</option>
                {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="division" className="block text-sm font-medium text-slate-700 mb-1">แผนก</label>
                <select 
                id="division" 
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)} 
                disabled={!selectedDepartment}
                className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                <option value="">ทั้งหมด</option>
                {filteredDivisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
                </select>
            </div>
            </div>
        )}
      </div>

      {/* IP Grid */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">สถานะ IP Address</h2>
        <div className="max-h-[450px] overflow-auto pb-4">
          <div className="grid grid-cols-8 gap-4 min-w-[900px]">
            {ips.map(ip => {
              const isAssigned = ip.status === 'Assigned';

              const passesFilters = (() => {
                const searchMatch = searchTerm === '' || ip.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
                if (!searchMatch) return false;

                const ipDeptId = ip.device?.departmentId;
                const ipDivId = ip.device?.division?.id;

                // Rule 1: Division filter only applies to assigned IPs
                if (selectedDivision && isAssigned && ipDivId !== selectedDivision) {
                    return false;
                }

                // Rule 2: Department filter
                if (selectedDepartment) {
                    if (isAssigned) {
                        // For assigned IPs, it must match the department.
                        // If department info is missing on the IP, we'll still show it so it doesn't get hidden by the filter.
                        if (ipDeptId && ipDeptId !== selectedDepartment) {
                            return false;
                        }
                    } else { // For 'Available' IPs
                        if (isSpecialDepartment) {
                            // For special depts, it must be in the range
                            const ipNum = ipToNumber(ip.ipAddress);
                            if (!numericRanges.some(range => ipNum >= range.min && ipNum <= range.max)) {
                                return false;
                            }
                        }
                        // For non-special depts, all 'Available' IPs are shown
                    }
                }
                
                return true; // If no rules caused it to be filtered, show it.
              })();

              const cardClasses = `
                p-3 border rounded-lg text-center font-mono text-sm transition-all duration-300 shadow-sm transform hover:-translate-y-1
                ${
                  isAssigned
                  ? 'bg-red-100 border-red-200 text-red-800 hover:bg-red-200'
                  : 'bg-green-100 border-green-200 text-green-800 hover:bg-green-200'
                }
                ${
                  isAssigned && ip.device ? 'cursor-pointer' : 'cursor-pointer'
                }
              `;
            
              const content = (
                  <>
                  <div className="font-semibold">{ip.ipAddress}</div>
                  <div className={`text-xs font-sans mt-1 ${isAssigned ? 'text-red-700' : 'text-green-700'}`}>
                      {isAssigned ? 'Assigned' : 'Available'}
                  </div>
                  </>
              );

              return (
                <div key={ip.id} style={{ display: passesFilters ? 'block' : 'none' }}>
                  {isAssigned && ip.device ? (
                      <button onClick={() => navigate(`/assets/${ip.device.id}`)} className={cardClasses}>
                        {content}
                      </button>
                  ) : (
                      <button onClick={() => handleOpenModal(ip)} className={cardClasses} disabled={isAssigned}>
                          {content}
                      </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isModalOpen && <AddAssetModal 
        onClose={handleCloseModal} 
        onAssetAdded={handleAssetAdded}
        initialData={modalInitialData}
        availableIps={availableIpsForModal}
      />}
    </>
  );
};

export default Dashboard;
