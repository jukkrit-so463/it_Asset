import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">โปรไฟล์</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="space-y-4">
            <div className="flex items-center">
                <span className="font-semibold w-24">ยศ:</span>
                <span className="text-slate-700">{user.rank}</span>
            </div>
            <div className="flex items-center">
                <span className="font-semibold w-24">ชื่อ:</span>
                <span className="text-slate-700">{user.firstName}</span>
            </div>
            <div className="flex items-center">
                <span className="font-semibold w-24">สกุล:</span>
                <span className="text-slate-700">{user.lastName}</span>
            </div>
            <div className="flex items-center">
                <span className="font-semibold w-24">Username:</span>
                <span className="text-slate-700">{user.username}</span>
            </div>
             <div className="flex items-center">
                <span className="font-semibold w-24">เบอร์โทร:</span>
                <span className="text-slate-700">{user.contactNumber}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
