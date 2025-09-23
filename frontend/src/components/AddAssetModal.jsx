import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const AddAssetModal = ({ onClose, onAssetAdded, initialData }) => {
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
    ipAddressId: initialData?.ipAddressId || '',
    departmentId: initialData?.departmentId || '',
    divisionId: initialData?.divisionId || '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, divisionsRes, ipsRes, leasedDevicesRes] = await Promise.all([
            axios.get('/api/departments'),
            axios.get('/api/divisions'),
            axios.get('/api/ips/available'),
            axios.get('/service tag.csv') // Fetch CSV from public folder
        ]);
        
        setDepartments(departmentsRes.data);
        setAllDivisions(divisionsRes.data);
        setAvailableIps(ipsRes.data);

        // Parse CSV data
        const lines = leasedDevicesRes.data.trim().split(/\r\n|\n|\r/);
        const headers = lines[0].split(',').map(h => h.trim().replace(/\uFEFF/g, '')); // Remove BOM
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


        if (initialData?.departmentId) {
            const divisionsForDepartment = divisionsRes.data.filter(
              (div) => div.departmentId === initialData.departmentId
            );
            setFilteredDivisions(divisionsForDepartment);
        }
      } catch (error) {
        console.error("Error fetching modal data:", error);
      }
    };
    fetchData();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'deviceType') {
        const isLeased = value === 'PC เช่า' || value === 'Notebook เช่า';
        setIsLeasedDevice(isLeased);
        // When device type changes, reset all related fields
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
        setServiceTagSearch(''); // Also reset service tag search
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

  const handleIpSearchChange = (e) => {
    setIpSearch(e.target.value);
    setIsIpDropdownOpen(true);
  };

  const handleSelectIp = (ip) => {
    setFormData({ ...formData, ipAddressId: ip.id });
    setIpSearch(ip.ipAddress);
    setIsIpDropdownOpen(false);
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

  const sourceIps = specialIpSuggestions.length > 0 ? specialIpSuggestions : availableIps;

  const filteredIps = sourceIps.filter(ip =>
    ip.ipAddress.toLowerCase().includes(ipSearch.toLowerCase())
  );

  const ranks = [
    "นาย", "นาง", "นางสาว", "จ.ต.", "จ.ต.หญิง", "จ.ท.", "จ.ท.หญิง", "จ.อ.", "จ.อ.หญิง", 
    "พ.จ.ต.", "พ.จ.ต.หญิง", "พ.จ.ท.", "พ.จ.ท.หญิง", "พ.จ.อ.", "พ.จ.อ.หญิง", 
    "ร.ต.", "ร.ต.หญิง", "ร.ท.", "ร.ท.หญิง", "ร.อ.", "ร.อ.หญิง", 
    "น.ต.", "น.ต.หญิง", "น.ท.", "น.ท.หญิง", "น.อ.", "น.อ.หญิง", 
    "พล ร.ต.", "พล ร.ต.หญิง", "พล ร.ท."
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Error: You are not logged in. Please log in and try again.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post('/api/assets', formData, config);
      onAssetAdded(res.data);
      onClose();
    } catch (error) {
      console.error('Failed to add asset', error);
      if (error.response) {
        const errorMsg = error.response.data.details ? `${error.response.data.error}. Details: ${error.response.data.details}` : error.response.data.error || error.response.statusText;
        alert(`Error: ${errorMsg}`);
      } else if (error.request) {
        alert('Error: No response from server. Please check your network connection.');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Filter leased devices based on selected deviceType
  const availableLeasedDevices = leasedDevices.filter(d => {
      if (formData.deviceType === 'PC เช่า') return d.type === 'pc';
      if (formData.deviceType === 'Notebook เช่า') return d.type === 'notebook';
      return false;
  });

  const filteredLeasedDevices = availableLeasedDevices.filter(d => 
    d.serviceTag.toLowerCase().includes(serviceTagSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Add New Asset</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IP and Grouping */}
            <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">IP & Grouping</h3>
                <div className="relative">
                    <label htmlFor="ipSearch" className="block text-sm font-medium text-gray-700">IP Address</label>
                    <input 
                        type="text"
                        id="ipSearch"
                        placeholder="Search or select an IP..."
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
                <div>
                    <label htmlFor="departmentId" className="block text-sm font-medium text-slate-600">Department</label>
                    <select 
                        name="departmentId" 
                        value={formData.departmentId} 
                        onChange={handleChange} 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md disabled:bg-slate-50 disabled:cursor-not-allowed"
                        disabled={!!initialData?.departmentId}
                    >
                        <option value="">Select Department</option>
                        {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                    </select>
                </div>
                {specialIpRanges.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">สามารถเลือกได้เฉพาะ IP :</span> {specialIpRanges.join(', ')}
                    </p>
                  </div>
                )}
                <div>
                    <label htmlFor="divisionId" className="block text-sm font-medium text-slate-600">Division</label>
                    <select name="divisionId" value={formData.divisionId} onChange={handleChange} disabled={!formData.departmentId} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md disabled:bg-slate-50">
                        <option value="">Select Division</option>
                        {filteredDivisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Device Info */}
            <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Device Information</h3>
                <div>
                    <label htmlFor="deviceType" className="block text-sm font-medium text-slate-600">Device Type</label>
                    <select name="deviceType" value={formData.deviceType} onChange={handleChange} required className="w-full input-style">
                        <option value="">Select Device Type</option>
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
                        <div className="relative">
                            <label htmlFor="serviceTagSearch" className="block text-sm font-medium text-gray-700">Service Tag</label>
                            <input 
                                type="text"
                                id="serviceTagSearch"
                                placeholder="Search or select a Service Tag..."
                                value={serviceTagSearch}
                                onChange={handleServiceTagSearchChange}
                                onFocus={() => setIsServiceTagDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsServiceTagDropdownOpen(false), 150)} // Delay to allow click
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
                        <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required readOnly className="w-full input-style bg-slate-100" />
                        <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} className="w-full input-style" />
                        {/* Display auto-filled data for user confirmation */}
                        {formData.serviceTag && (
                            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-600 space-y-1">
                                <p><strong>S/N Monitor:</strong> {formData.snMonitor || 'N/A'}</p>
                                <p><strong>S/N UPS:</strong> {formData.snUps || 'N/A'}</p>
                                <p><strong>Sticker:</strong> {formData.colorSticker || 'N/A'}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required className="w-full input-style" />
                        <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} className="w-full input-style" />
                        <input name="serviceTag" placeholder="Service Tag / Serial Number" value={formData.serviceTag} onChange={handleChange} required className="w-full input-style" />
                    </>
                )}

                <input name="macAddress" placeholder="MAC Address" value={formData.macAddress} onChange={handleChange} className="w-full input-style" />
                <div>
                    <label htmlFor="dateReceived" className="block text-sm font-medium text-slate-600">Date Received</label>
                    <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleChange} required className="w-full input-style" />
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-600">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} required className="w-full input-style">
                        <option value="Active">Active</option>
                        <option value="In Repair">In Repair</option>
                        <option value="Retired">Retired</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-600">Notes</label>
                    <textarea name="notes" placeholder="Additional notes..." value={formData.notes} onChange={handleChange} className="w-full input-style"></textarea>
                </div>
            </div>
          </div>

          {/* User Info */}
            <div className="space-y-4 p-4 border rounded-md mt-4">
                <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Assigned User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="rank" value={formData.rank} onChange={handleChange} className="w-full input-style">
                        <option value="">Select Rank</option>
                        {ranks.map(rank => <option key={rank} value={rank}>{rank}</option>)}
                    </select>
                    <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full input-style" />
                    <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full input-style" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full input-style" />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full input-style" />
                    <input type="tel" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="w-full input-style" />
                </div>
            </div>

          <div className="flex justify-end pt-4 mt-auto">
            <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg">
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;