import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { apiService } from '@/services/api';
import UserModal from '@/components/modals/UserModal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { Badge } from '@/components/ui/badge';

// 1. อัปเดต Interface ของ User ให้มี username
interface User {
  user_id: number;
  username: string; // <--- เพิ่มบรรทัดนี้
  email: string;
  first_name: string;
  last_name: string;
  rank: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  locations_id: number;
}

interface Location {
  locations_id: number;
  division: string;
  department: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadUsers(), loadLocations()]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiService.getUsers() as ApiResponse<User[]>;
      if (response.success) {
        setUsers(response.data);
      } else {
        toast.error(response.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน');
    }
  };

  const loadLocations = async () => {
    try {
      const response = await apiService.getLocations() as ApiResponse<Location[]>;
      if (response.success) {
        setLocations(response.data);
      } else {
        toast.error(response.message || 'Failed to load locations');
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสถานที่');
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    loadUsers(); 
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await apiService.deleteUser(userToDelete.user_id.toString());
      toast.success('ลบผู้ใช้งานสำเร็จ');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    } finally {
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const getLocationName = (locationId: number) => {
    const location = locations.find(loc => loc.locations_id === locationId);
    return location ? `${location.division} / ${location.department}` : 'N/A';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
        <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
          <CirclePlus className="mr-2 h-4 w-4" /> เพิ่มผู้ใช้งาน
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* 2. เพิ่ม Header ของตาราง */}
                <TableHead>Username</TableHead> 
                <TableHead>ชื่อ-สกุล</TableHead>
                <TableHead>หน่วยงาน</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การกระทำ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  {/* 3. เพิ่ม Cell แสดงข้อมูล */}
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{getLocationName(user.locations_id)}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ตอนนี้ส่วนนี้จะไม่มี Error แล้ว */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
          onSuccess={handleSave}
          user={editingUser}
        />
      )}

      {isConfirmOpen && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="ยืนยันการลบ"
          description={`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน ${userToDelete?.username}?`}
        />
      )}
    </div>
  );
};

export default UsersPage;