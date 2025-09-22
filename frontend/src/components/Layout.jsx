import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiMonitor, FiServer, FiPrinter, FiSearch, FiBell, FiUser, FiLogOut, FiFileText, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../App'; // Assuming App.jsx is in ../

const AdminNav = () => {
    const linkClasses = "flex items-center p-3 text-slate-600 hover:bg-sky-50 rounded-lg";
    const activeLinkClasses = "bg-sky-100 text-slate-800 font-semibold";
    return (
        <>
            <li className="mb-2">
                <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FiGrid className="mr-3" />
                    Dashboard
                </NavLink>
            </li>
            <li className="mb-2">
                <NavLink to="/assets" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FiMonitor className="mr-3" />
                    อุปกรณ์
                </NavLink>
            </li>
            <li className="mb-2">
                <NavLink to="/departments" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FiServer className="mr-3" />
                    กอง/แผนก
                </NavLink>
            </li>
            <li className="mb-2">
                <NavLink to="/reports" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FiPrinter className="mr-3" />
                    รายงาน
                </NavLink>
            </li>
        </>
    );
}

const UserNav = () => {
    const linkClasses = "flex items-center p-3 text-slate-600 hover:bg-sky-50 rounded-lg";
    const activeLinkClasses = "bg-sky-100 text-slate-800 font-semibold";
    return (
        <li className="mb-2">
            <NavLink to="/my-asset" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                <FiFileText className="mr-3" />
                My Asset
            </NavLink>
        </li>
    );
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 w-64 bg-white shadow-md h-screen flex-shrink-0 flex flex-col z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 bg-sky-500 text-white text-2xl font-bold">
                    <NavLink to="/">ระบบจักการ อุปกรณ์ IT กรมแพทย์ทหารเรือ</NavLink>
                    <button onClick={toggleSidebar} className="md:hidden text-white">
                        <FiX className="h-6 w-6" />
                    </button>
                </div>
                <nav className="p-4 flex-1">
                    <ul>
                        {user?.role === 'ADMIN' ? <AdminNav /> : <UserNav />}
                    </ul>
                </nav>
            </div>
        </>
    );
};

const Header = ({ toggleSidebar }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm py-4 px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="text-slate-500 focus:outline-none md:hidden mr-4">
                    <FiMenu className="h-6 w-6" />
                </button>
                
            </div>
            <div className="flex items-center space-x-4">
                <FiBell className="text-slate-500 h-6 w-6 cursor-pointer hover:text-sky-600" />
                <div className="relative">
                    <div className="flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                         <FiUser className="text-slate-500 h-6 w-6 hover:text-sky-600" />
                         <span className="ml-2 text-sm font-medium text-slate-700">{user?.username}</span>
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
                            <NavLink to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-100">โปรไฟล์</NavLink>
                            <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <FiLogOut className="mr-2" />
                                ออกจากระบบ
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-white text-left text-sm py-4 px-6 lg:px-8 text-slate-500 border-t">
            © {new Date().getFullYear()} IT Asset Management NMD. All Rights Reserved.
        </footer>
    );
};

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex bg-sky-50 h-screen font-sans">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
