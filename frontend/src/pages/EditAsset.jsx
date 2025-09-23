import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ErrorModal from '../components/ErrorModal';

const EditAsset = () => {
  const [departments, setDepartments] = useState([]);
  const [allDivisions, setAllDivisions] = useState([]);
  const [filteredDivisions, setFilteredDivisions] = useState([]);
  const [availableIps, setAvailableIps] = useState([]);
  const [ipSearch, setIpSearch] = useState('');
  const [isIpDropdownOpen, setIsIpDropdownOpen] = useState(false);
  const [specialIpRanges, setSpecialIpRanges] = useState([]);
  const [specialIpSuggestions, setSpecialIpSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    ipAddressId: '',
    departmentId: '',
    divisionId: '',
    deviceType: '',
    brand: '',
    model: '',
    serviceTag: '',
    macAddress: '',
    dateReceived: '',
    status: 'Active',
    notes: '',
    rank: '',
    firstName: '',
    lastName: '',
    username: '',
    contactNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetRes, departmentsRes, divisionsRes, ipsRes] = await Promise.all([
          axios.get(`/api/assets/${id}`),
          axios.get('/api/departments'),
          axios.get('/api/divisions'),
          axios.get('/api/ips') // Fetch all IPs
        ]);

        const asset = assetRes.data;
        const allIps = ipsRes.data;
        setDepartments(departmentsRes.data);
        setAllDivisions(divisionsRes.data);
        
        const currentIp = allIps.find(ip => ip.id === asset.ipAddressId);
        const availableIpsList = allIps.filter(ip => ip.status === 'Available' || ip.id === asset.ipAddressId);
        setAvailableIps(availableIpsList);

        if (asset.departmentId) {
          const selectedDept = departmentsRes.data.find(dep => dep.id === asset.departmentId);
          if (selectedDept && selectedDept.specialIpRanges) {
            const ranges = selectedDept.specialIpRanges.split(',').map(r => r.trim());
            setSpecialIpRanges(ranges);

            const suggestions = availableIpsList.filter(ip => {
              const ipParts = ip.ipAddress.split('.').map(Number);
              const ipAsInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

              return ranges.some(range => {
                  if (range.includes('-')) {
                      const [startIp, endIp] = range.split('-');
                      const startParts = startIp.split('.').map(Number);
                      const endParts = endIp.split('.').map(Number);
                      const startAsInt = (startParts[0] << 24) | (startParts[1] << 16) | (startParts[2] << 8) | startParts[3];
                      const endAsInt = (endParts[0] << 24) | (endParts[1] << 16) | (endParts[2] << 8) | endParts[3];
                      return ipAsInt >= startAsInt && ipAsInt <= endAsInt;
                  } else {
                      return ip.ipAddress.startsWith(range);
                  }
              });
            });
            setSpecialIpSuggestions(suggestions);
          }

          const divisionsForAssetDepartment = divisionsRes.data.filter(
            (div) => div.departmentId === asset.departmentId
          );
          setFilteredDivisions(divisionsForAssetDepartment);
        }

        setFormData({
          ipAddressId: asset.ipAddressId || '',
          departmentId: asset.departmentId || '',
          divisionId: asset.divisionId || '',
          deviceType: asset.deviceType,
          brand: asset.brand,
          model: asset.model,
          serviceTag: asset.serviceTag,
          macAddress: asset.macAddress,
          dateReceived: new Date(asset.dateReceived).toISOString().split('T')[0],
          status: asset.status,
          notes: asset.notes || '',
          rank: asset.user?.rank || '',
          firstName: asset.user?.firstName || '',
          lastName: asset.user?.lastName || '',
          username: asset.user?.username || '',
          contactNumber: asset.user?.contactNumber || ''
        });
        setIpSearch(currentIp?.ipAddress || '');
      } catch (error) {
        console.error("Error fetching asset data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleIpSearchChange = (e) => {
    setIpSearch(e.target.value);
    setIsIpDropdownOpen(true);
  };

  const handleSelectIp = (ip) => {
    setFormData({ ...formData, ipAddressId: ip.id });
    setIpSearch(ip.ipAddress);
    setIsIpDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'departmentId') {
      if (value) {
        const selectedDept = departments.find(dep => dep.id === value);
        if (selectedDept && selectedDept.specialIpRanges) {
          const ranges = selectedDept.specialIpRanges.split(',').map(r => r.trim());
          setSpecialIpRanges(ranges);

          const suggestions = availableIps.filter(ip => {
            const ipParts = ip.ipAddress.split('.').map(Number);
            const ipAsInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

            return ranges.some(range => {
                if (range.includes('-')) {
                    const [startIp, endIp] = range.split('-');
                    const startParts = startIp.split('.').map(Number);
                    const endParts = endIp.split('.').map(Number);
                    const startAsInt = (startParts[0] << 24) | (startParts[1] << 16) | (startParts[2] << 8) | startParts[3];
                    const endAsInt = (endParts[0] << 24) | (endParts[1] << 16) | (endParts[2] << 8) | endParts[3];
                    return ipAsInt >= startAsInt && ipAsInt <= endAsInt;
                } else {
                    return ip.ipAddress.startsWith(range);
                }
            });
          });
          setSpecialIpSuggestions(suggestions);
        } else {
          setSpecialIpRanges([]);
          setSpecialIpSuggestions([]);
        }

        const divisionsForDepartment = allDivisions.filter(
          (div) => div.departmentId === value
        );
        setFilteredDivisions(divisionsForDepartment);
      } else {
        setFilteredDivisions([]);
        setSpecialIpRanges([]);
        setSpecialIpSuggestions([]);
      }
      setFormData((prev) => ({ ...prev, divisionId: '', ipAddressId: '' }));
      setIpSearch('');
    }
  };

  const ranks = [
    "นาย", "นาง", "นางสาว", "จ.ต.", "จ.ต.หญิง", "จ.ท.", "จ.ท.หญิง", "จ.อ.", "จ.อ.หญิง", 
    "พ.จ.ต.", "พ.จ.ต.หญิง", "พ.จ.ท.", "พ.จ.ท.หญิง", "พ.จ.อ.", "พ.จ.อ.หญิง", 
    "ร.ต.", "ร.ต.หญิง", "ร.ท.", "ร.ท.หญิง", "ร.อ.", "ร.อ.หญิง", 
    "น.ต.", "น.ต.หญิง", "น.ท.", "น.ท.หญิง", "น.อ.", "น.อ.หญิง", 
    "พล ร.ต.", "พล ร.ต.หญิง", "พล ร.ท."
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/api/assets/${id}`, formData);
      navigate(`/assets/${id}`);
    } catch (err) {
      console.error("Failed to update asset", err);
      if (err.response) {
        const errorMsg = err.response.data?.message || JSON.stringify(err.response.data);
        setError(errorMsg);
      } else if (err.request) {
        setError('No response from the server. Please check if the backend is running.');
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  const sourceIps = specialIpSuggestions.length > 0 ? specialIpSuggestions : availableIps;
  const filteredIps = sourceIps.filter(ip =>
    ip.ipAddress.toLowerCase().includes(ipSearch.toLowerCase())
  );

  return (
    <>
      <ErrorModal message={error} onClose={() => setError('')} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
            <div className="flex items-center justify-center">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">แก้ไขข้อมูลอุปกรณ์ IT</h2>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
                อัพเดทรายละเอียดของทรัพย์สินนี้และผู้ใช้ที่ได้รับมอบหมาย
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Grouping */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">1. จัดการ IP และ Grouping</h3>
                    <p className="mt-1 text-sm text-gray-500">อัพเดทที่อยู่ IP กองและแผนก</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {/* IP Address Dropdown */}
                    <div className="relative">
                        <label htmlFor="ipSearch" className="block text-sm font-medium text-gray-700">IP Address</label>
                        <input 
                            type="text"
                            id="ipSearch"
                            placeholder="Search or select an IP..."
                            value={ipSearch}
                            onChange={handleIpSearchChange}
                            onFocus={() => setIsIpDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsIpDropdownOpen(false), 150)} // Delay to allow click
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                        {isIpDropdownOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {filteredIps.length > 0 ? (
                                    filteredIps.map(ip => (
                                        <li key={ip.id} onClick={() => handleSelectIp(ip)} className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white">
                                            {ip.ipAddress}
                                        </li>
                                    ))
                                ) : (
                                    <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">No IPs found</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">กอง</label>
                        <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">โปรดเลือกกอง</option>
                            {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                        </select>
                    </div>
                     {specialIpRanges.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md sm:col-span-2">
                            <p className="text-sm text-blue-700">
                            <span className="font-semibold">สามารถเลือกได้เฉพาะ IP :</span> {specialIpRanges.join(', ')}
                            </p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="divisionId" className="block text-sm font-medium text-gray-700">แผนก</label>
                        <select name="divisionId" value={formData.divisionId} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">โปรดเลือกแผนก</option>
                            {filteredDivisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
                        </select>
                    </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-6 pt-8">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">2. ข้อมูลอุปกรณ์</h3>
                    <p className="mt-1 text-sm text-gray-500">เลือกรายละเอียดอุปกรณ์</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">การได้มา</label>
                        <select 
                            name="deviceType" 
                            value={formData.deviceType} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="">เลือกที่มาอุปกรณ์</option>
                            <optgroup label="PC">
                                <option value="PC เช่า">PC เช่า</option>
                                <option value="PC สสท.">PC สสท.</option>
                                <option value="PC พร.">PC พร.</option>
                                <option value="PC ส่วนตัว">PC ส่วนตัว</option>
                            </optgroup>
                            <optgroup label="Notebook">
                                <option value="Notebook เช่า">Notebook เช่า</option>
                                <option value="Notebook สสท.">Notebook สสท.</option>
                                <option value="Notebook พร.">Notebook พร.</option>
                                <option value="Notebook ส่วนตัว">Notebook ส่วนตัว</option>
                            </optgroup>
                            <option value="Printer">Printer</option>
                            <option value="Printer Server">Printer Server</option>
                            <option value="อุปกรณ์แม่ข่าย">อุปกรณ์แม่ข่าย</option>
                        </select>
                    </div>
                    <input name="brand" placeholder="ยี่ห้อ" value={formData.brand} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <input name="model" placeholder="รุ่น" value={formData.model} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <input name="serviceTag" placeholder="Service Tag" value={formData.serviceTag} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <input name="macAddress" placeholder="MAC Address" value={formData.macAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <div>
                        <label htmlFor="dateReceived" className="block text-sm font-medium text-gray-700">รับมาเมื่อ</label>
                        <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">สถานะ</label>
                        <select name="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="Active">Active</option>
                            <option value="In Repair">In Repair</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">หมายเหตุ</label>
                        <textarea name="notes" placeholder="หมายเหตุ เพิ่มเติม..." value={formData.notes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-6 pt-8">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">3. ข้อมูลผู้ใช้ที่ได้รับมอบหมาย</h3>
                    <p className="mt-1 text-sm text-gray-500">อัพเดทผู้ใช้ที่ได้รับมอบหมาย</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="rank" className="block text-sm font-medium text-gray-700">ยศ</label>
                        <select name="rank" value={formData.rank} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">เลือก ยศ</option>
                            {ranks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                        <input name="firstName" placeholder="ชื่อ" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">สกุล</label>
                        <input name="lastName" placeholder="สกุล" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                        <input type="tel" name="contactNumber" placeholder="เบอร์โทร" value={formData.contactNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-between items-center">
                    <Link to={`/assets/${id}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center">
                        <FiArrowLeft className="mr-1" />
                        กลับไปหน้า รายละเอียด
                    </Link>
                    <div className="flex justify-end">
                        <Link to={`/assets/${id}`} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            ยกเลิก
                        </Link>
                        <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            อัพเดท
                        </button>
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAsset;