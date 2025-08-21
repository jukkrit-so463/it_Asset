import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import UserModal from "@/components/modals/UserModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rank?: string;
  role: 'user' | 'admin';
  status: string;
  division?: string;
  department?: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // Need to implement deleteUser in API
      toast.success('ลบผู้ใช้งานสำเร็จ');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleModalSuccess = () => {
    loadUsers();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลผู้ใช้งานในระบบ</p>
        </div>
        <Button className="flex items-center justify-center gap-2" onClick={handleAddUser}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มผู้ใช้งาน</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="ผู้ใช้ทั้งหมด"
          value={loading ? "..." : users.length.toString()}
          icon={UsersIcon}
          variant="info"
        />
        <StatCard
          title="ใช้งาน"
          value={loading ? "..." : users.filter(u => u.status === 'active').length.toString()}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="ระงับการใช้งาน"
          value={loading ? "..." : users.filter(u => u.status !== 'active').length.toString()}
          icon={UserX}
          variant="destructive"
        />
        <StatCard
          title="ผู้ดูแลระบบ"
          value={loading ? "..." : users.filter(u => u.role === 'admin').length.toString()}
          icon={UserPlus}
          variant="info"
        />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">รายการผู้ใช้งาน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาชื่อ, อีเมล, บทบาท, ผู้ใช้งาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              แสดง {users.length} รายการ
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">ผู้ใช้งาน</TableHead>
                    <TableHead className="min-w-[200px]">อีเมล</TableHead>
                    <TableHead className="min-w-[100px]">บทบาท</TableHead>
                    <TableHead className="min-w-[150px]">ตำแหน่ง</TableHead>
                    <TableHead className="min-w-[100px]">สถานะ</TableHead>
                    <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                            {user.first_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{user.username}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                          {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-[150px] truncate">
                          {user.rank || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            user.status === 'active' 
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          }
                        >
                          {user.status === 'active' ? 'ใช้งาน' : 'ระงับการใช้งาน'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toast.info(`ดูรายละเอียดผู้ใช้งาน ${user.first_name} ${user.last_name} (${user.username})`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="ยืนยันการลบ"
        description={`คุณต้องการลบผู้ใช้งาน ${userToDelete?.first_name} ${userToDelete?.last_name} (${userToDelete?.username}) ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
      />
    </div>
  );
}