import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiPrinter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Reports = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  
  // Filter states
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [selectedColorSticker, setSelectedColorSticker] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, departmentsRes, divisionsRes] = await Promise.all([
          axios.get('/api/assets'),
          axios.get('/api/departments'),
          axios.get('/api/divisions'),
        ]);
        setAssets(assetsRes.data);
        setDepartments(departmentsRes.data);
        setDivisions(divisionsRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const department = asset.department?.name || '';
      const division = asset.division?.name || '';
      const user = asset.user ? `${asset.user.rank} ${asset.user.firstName} ${asset.user.lastName}` : '';
      const ip = asset.ipAddress?.ipAddress || '';

      const searchMatch = searchTerm.toLowerCase() === '' ||
        department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.brand && asset.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (asset.model && asset.model.toLowerCase().includes(searchTerm.toLowerCase()));

      const departmentMatch = selectedDepartment === '' || asset.department?.id === selectedDepartment;
      const divisionMatch = selectedDivision === '' || asset.division?.id === selectedDivision;
      const deviceTypeMatch = selectedDeviceType === '' || asset.deviceType === selectedDeviceType;
      const colorStickerMatch = selectedColorSticker === '' || asset.colorSticker === selectedColorSticker;

      // Apply color sticker filter only when device type is 'PC เช่า'
      if (selectedDeviceType === 'PC เช่า') {
        return searchMatch && departmentMatch && divisionMatch && deviceTypeMatch && colorStickerMatch;
      }

      return searchMatch && departmentMatch && divisionMatch && deviceTypeMatch;
    });
  }, [assets, searchTerm, selectedDepartment, selectedDivision, selectedDeviceType, selectedColorSticker]);

  const handlePrint = () => {
    window.print();
  };

  const handleDeviceTypeChange = (e) => {
    const newDeviceType = e.target.value;
    setSelectedDeviceType(newDeviceType);
    // Reset color sticker filter if device type is not 'PC เช่า'
    if (newDeviceType !== 'PC เช่า') {
      setSelectedColorSticker('');
    }
  };

  const filteredDivisions = selectedDepartment 
    ? divisions.filter(d => d.departmentId === selectedDepartment)
    : [];

  const deviceTypes = [...new Set(assets.map(a => a.deviceType))];

  const colorStickers = useMemo(() => {
    const stickers = assets
        .filter(a => a.deviceType === 'PC เช่า' && a.colorSticker)
        .map(a => a.colorSticker);
    return [...new Set(stickers)];
  }, [assets]);

  if (loading) {
    return <div className="text-center p-8">Loading report data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-section, #print-section * {
              visibility: visible;
            }
            #print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>

      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold">รายงานอุปกรณ์</h1>
        <button 
          onClick={handlePrint}
          className="inline-flex items-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <FiPrinter className="mr-2" />
          พิมพ์รายงาน
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 no-print">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
            <h2 className="text-lg font-semibold text-slate-700">กรองข้อมูล</h2>
            {filtersVisible ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {filtersVisible && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm"
              />
              <select value={selectedDepartment} onChange={e => {setSelectedDepartment(e.target.value); setSelectedDivision('');}} className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm">
                <option value="">กอง ทั้งหมด</option>
                {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
              </select>
              <select value={selectedDivision} onChange={e => setSelectedDivision(e.target.value)} disabled={!selectedDepartment} className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm disabled:bg-slate-50">
                <option value="">แผนก ทั้งหมด</option>
                {filteredDivisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
              </select>
              
              <select value={selectedDeviceType} onChange={handleDeviceTypeChange} className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm">
                <option value="">การได้มา ทั้งหมด</option>
                {deviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>

              {selectedDeviceType === 'PC เช่า' && (
                <select value={selectedColorSticker} onChange={e => setSelectedColorSticker(e.target.value)} className="w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md shadow-sm">
                  <option value="">All Color Stickers</option>
                  {colorStickers.map(sticker => <option key={sticker} value={sticker}>{sticker}</option>)}
                </select>
              )}
            </div>
        )}
      </div>

      <div id="print-section" className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-center">สรุป อุปกรณ์ IT</h2>
            <p className="text-center text-sm text-slate-500">สร้างเมื่อ: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th className="py-3 px-4 text-left">IP Address</th>
                <th className="py-3 px-4 text-left">Service Tag</th>
                <th className="py-3 px-4 text-left">การได้มา</th>
                <th className="py-3 px-4 text-left">กอง</th>
                <th className="py-3 px-4 text-left">แผนก</th>
                <th className="py-3 px-4 text-left">ผู้ใช้</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="border-b border-slate-200">
                  <td className="py-2 px-4">{asset.ipAddress?.ipAddress || 'N/A'}</td>
                  <td className="py-2 px-4">{asset.serviceTag}</td>
                  <td className="py-2 px-4">{asset.deviceType}</td>
                  <td className="py-2 px-4">{asset.department?.name || 'N/A'}</td>
                  <td className="py-2 px-4">{asset.division?.name || 'N/A'}</td>
                  <td className="py-2 px-4">{asset.user ? `${asset.user.rank} ${asset.user.firstName} ${asset.user.lastName}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-right text-sm text-slate-500 border-t">
            อุปกรณ์ ทั้งหมด: {filteredAssets.length}
        </div>
      </div>
    </div>
  );
};

export default Reports;
