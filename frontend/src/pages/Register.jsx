import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ErrorModal from '../components/ErrorModal';

const Register = () => {
  const [departments, setDepartments] = useState([]);
  const [allDivisions, setAllDivisions] = useState([]);
  const [filteredDivisions, setFilteredDivisions] = useState([]);
  const [availableIps, setAvailableIps] = useState([]);
  const [ipSearch, setIpSearch] = useState('');
  const [isIpDropdownOpen, setIsIpDropdownOpen] = useState(false);
  const [specialIpRanges, setSpecialIpRanges] = useState([]);
  const [specialIpSuggestions, setSpecialIpSuggestions] = useState([]);
  
  // State for leased devices
  const [leasedDevices, setLeasedDevices] = useState([]);
  const [isLeasedDevice, setIsLeasedDevice] = useState(false);
  const [serviceTagSearch, setServiceTagSearch] = useState('');
  const [isServiceTagDropdownOpen, setIsServiceTagDropdownOpen] = useState(false);

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
    password: '',
    contactNumber: '',
    snMonitor: '',
    snUps: '',
    colorSticker: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, divisionsRes, ipsRes, leasedDevicesRes] = await Promise.all([
          axios.get('/api/departments'),
          axios.get('/api/divisions'),
          axios.get('/api/ips/available'),
          axios.get('/service tag.csv')
        ]);
        setDepartments(departmentsRes.data);
        setAllDivisions(divisionsRes.data);
        setAvailableIps(ipsRes.data);

        // Parse CSV data
        const lines = leasedDevicesRes.data.trim().split(/\r\n|\n|\r/);
        const headers = lines[0].split(',').map(h => h.trim().replace(/\uFEFF/g, ''));
        const devices = lines.slice(1).map(line => {
            const values = line.split(',');
            const device = {};
            headers.forEach((header, index) => {
                let key = header;
                if (header === 'service tag') key = 'serviceTag';
                if (header === 's/n monitor') key = 'snMonitor';
                if (header === 's/n ups') key = 'snUps';
                if (header === 'color sticker') key = 'colorSticker';
                device[key] = values[index] ? values[index].trim() : '';
            });
            return device;
        });
        setLeasedDevices(devices);

      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load required data for the form. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleIpSearchChange = (e) => {
    setIpSearch(e.target.value);
    setIsIpDropdownOpen(true);
  };

  const handleSelectIp = (ip) => {
    setFormData({ ...formData, ipAddressId: ip.id });
    setIpSearch(ip.ipAddress);
    setIsIpDropdownOpen(false);
  };

  const sourceIps = specialIpSuggestions.length > 0 ? specialIpSuggestions : availableIps;

  const filteredIps = sourceIps.filter(ip =>
    ip.ipAddress.toLowerCase().includes(ipSearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'deviceType') {
        const isLeased = value === 'PC เช่า' || value === 'Notebook เช่า';
        setIsLeasedDevice(isLeased);
        setFormData(prev => ({
            ...prev,
            deviceType: value,
            brand: '',
            model: '',
            serviceTag: '',
            snMonitor: '',
            snUps: '',
            colorSticker: '',
        }));
        setServiceTagSearch('');
    } else {
        setFormData({ ...formData, [name]: value });
    }

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

  const handleServiceTagSearchChange = (e) => {
    setServiceTagSearch(e.target.value);
    setIsServiceTagDropdownOpen(true);
  };

  const handleSelectServiceTag = (device) => {
    setFormData(prev => ({
        ...prev,
        brand: device.brand || '',
        serviceTag: device.serviceTag || '',
        snMonitor: device.snMonitor || '',
        snUps: device.snUps || '',
        colorSticker: device.colorSticker || '',
        model: '', // Clear model as it's not in the CSV
    }));
    setServiceTagSearch(device.serviceTag);
    setIsServiceTagDropdownOpen(false);
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

    const requiredFields = {
        username: "Username",
        password: "Password",
        ipAddressId: "IP Address",
        departmentId: "Department",
        divisionId: "Division",
        deviceType: "Device Type",
        brand: "Brand",
        serviceTag: "Service Tag",
        dateReceived: "Date Received",
        firstName: "First Name",
        lastName: "Last Name"
    };

    for (const field in requiredFields) {
        if (!formData[field]) {
            setError(`Please fill out the ${requiredFields[field]} field.`);
            return;
        }
    }

    try {
      await axios.post('/api/auth/register', formData);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error("Registration submission error:", err);
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

  const availableLeasedDevices = leasedDevices.filter(d => {
      if (formData.deviceType === 'PC เช่า') return d.type === 'pc';
      if (formData.deviceType === 'Notebook เช่า') return d.type === 'notebook';
      return false;
  });

  const filteredLeasedDevices = availableLeasedDevices.filter(d => 
    d.serviceTag.toLowerCase().includes(serviceTagSearch.toLowerCase())
  );

  return (
    <>
      <ErrorModal message={error} onClose={() => setError('')} />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
            <div className="flex items-center justify-center">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">สมัครสมาชิก</h2>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
                กรอกรายละเอียดด้านล่างเพื่อลงทะเบียนผู้ใช้ใหม่และกำหนดอุปกรณ์
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Grouping */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">1. จัดการกลุ่ม</h3>
                    <p className="mt-1 text-sm text-gray-500">กำหนด กองและแผนก</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">กอง</label>
                        <select id="departmentId" name="departmentId" value={formData.departmentId} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">เลือกกอง</option>
                            {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="divisionId" className="block text-sm font-medium text-gray-700">แผนก</label>
                        <select id="divisionId" name="divisionId" value={formData.divisionId} onChange={handleChange} disabled={!formData.departmentId} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-50">
                            <option value="">เลือกแผนก</option>
                            {filteredDivisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
                        </select>
                    </div>
                </div>
                {specialIpRanges.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">สามารถเลือกได้เฉพาะ IP :</span> {specialIpRanges.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Section 2: Device Information */}
              <div className="space-y-6 pt-8">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">2. ข้อมูลอุปกรณ์</h3>
                    <p className="mt-1 text-sm text-gray-500">กรอกรายละเอียดของอุปกรณ์ที่ได้รับมอบหมายให้กับผู้ใช้งาน</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {/* IP Address Dropdown */}
                    <div className="relative sm:col-span-1">
                        <label htmlFor="ipSearch" className="block text-sm font-medium text-gray-700">IP Address</label>
                        <input 
                            type="text"
                            id="ipSearch"
                            placeholder="ค้นหาและเลือก IP..."
                            value={ipSearch}
                            onChange={handleIpSearchChange}
                            onFocus={() => setIsIpDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsIpDropdownOpen(false), 150)}
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

                    <div className="sm:col-span-1">
                        <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">การได้มา</label>
                        <select id="deviceType" name="deviceType" value={formData.deviceType} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">เลือกประเภทการได้มา</option>
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

                    {isLeasedDevice ? (
                        <>
                            <div className="relative sm:col-span-1">
                                <label htmlFor="serviceTagSearch" className="block text-sm font-medium text-gray-700">Service Tag</label>
                                <input 
                                    type="text"
                                    id="serviceTagSearch"
                                    placeholder="Search or select a Service Tag..."
                                    value={serviceTagSearch}
                                    onChange={handleServiceTagSearchChange}
                                    onFocus={() => setIsServiceTagDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsServiceTagDropdownOpen(false), 150)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                                {isServiceTagDropdownOpen && (
                                    <ul className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        {filteredLeasedDevices.length > 0 ? (
                                            filteredLeasedDevices.map(d => (
                                                <li key={d.serviceTag} onClick={() => handleSelectServiceTag(d)} className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white">
                                                    {d.serviceTag}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">No matching service tags found</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                                <input name="brand" id="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm" />
                            </div>
                             <div className="sm:col-span-2">
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                                <input name="model" id="model" placeholder="Model" value={formData.model} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            {formData.serviceTag && (
                                <div className="sm:col-span-2 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-600 space-y-1">
                                    <p><strong>S/N Monitor:</strong> {formData.snMonitor || 'N/A'}</p>
                                    <p><strong>S/N UPS:</strong> {formData.snUps || 'N/A'}</p>
                                    <p><strong>Sticker:</strong> {formData.colorSticker || 'N/A'}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="sm:col-span-1">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">ยี่ห้อ</label>
                                <input name="brand" id="brand" placeholder="ยี่ห้อ" value={formData.brand} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700">รุ่น</label>
                                <input name="model" id="model" placeholder="รุ่น" value={formData.model} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="serviceTag" className="block text-sm font-medium text-gray-700">Service Tag / Serial Number</label>
                                <input name="serviceTag" id="serviceTag" placeholder="Service Tag / Serial Number" value={formData.serviceTag} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </>
                    )}

                    <div className="sm:col-span-2">
                        <label htmlFor="macAddress" className="block text-sm font-medium text-gray-700">MAC Address</label>
                        <input name="macAddress" id="macAddress" placeholder="MAC Address" value={formData.macAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="dateReceived" className="block text-sm font-medium text-gray-700">รับเมื่อ</label>
                        <input type="date" id="dateReceived" name="dateReceived" value={formData.dateReceived} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">สถานะ</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="Active">Active</option>
                            <option value="In Repair">In Repair</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">หมายเหตุ</label>
                        <textarea id="notes" name="notes" placeholder="หมายเหตุเพิ่มเติม..." value={formData.notes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                </div>
              </div>

              {/* Section 3: User Information */}
              <div className="space-y-6 pt-8">
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">3. ข้อมูลผู้ใช้งาน</h3>
                    <p className="mt-1 text-sm text-gray-500">สร้างข้อมูลประจำตัวในการใช้เข้าสู่ระบบและดูข้อมูล</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="rank" className="block text-sm font-medium text-gray-700">ชั้นยศ</label>
                        <select id="rank" name="rank" value={formData.rank} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">เลือก ชั้นยศ</option>
                            {ranks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                        <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="นาวี" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">สกุล</label>
                        <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="รักไทย" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required placeholder="navy.ru" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                        <input type="tel" name="contactNumber" id="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="0812345678" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end items-center">
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center mr-4">
                        <FiArrowLeft className="mr-1" />
                        กลับ เข้าสู่ระบบ
                    </Link>
                    <Link to="/login" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        ยกเลิก
                    </Link>
                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        สมัครสมาชิก
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
