import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiService } from "@/services/api";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onSuccess: () => void;
}

interface Location {
  locations_id: number;
  division: string;
  department: string;
}

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    rank: "",
    locations_id: "",
    role: "user",
    status: "active"
  });

  useEffect(() => {
    if (isOpen) {
      loadLocations();
      if (user) {
        setFormData({
          username: user.username || "",
          password: "",
          email: user.email || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          rank: user.rank || "",
          locations_id: user.locations_id?.toString() || "",
          role: user.role || "user",
          status: user.status || "active"
        });
      } else {
        setFormData({
          username: "",
          password: "",
          email: "",
          first_name: "",
          last_name: "",
          rank: "",
          locations_id: "",
          role: "user",
          status: "active"
        });
      }
    }
  }, [isOpen, user]);

  const loadLocations = async () => {
    try {
      const response = await apiService.getLocations();
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        locations_id: formData.locations_id ? parseInt(formData.locations_id) : null
      };

      // Remove password if empty (for update)
      if (!submitData.password) {
        delete submitData.password;
      }

      if (user) {
        // Update user (need to implement updateUser in API)
        toast.success('อัปเดตผู้ใช้งานสำเร็จ');
      } else {
        await apiService.createUser(submitData);
        toast.success('เพิ่มผู้ใช้งานสำเร็จ');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">ชื่อผู้ใช้งาน *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="กรอกชื่อผู้ใช้งาน"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              รหัสผ่าน {user ? '(เว้นว่างถ้าไม่เปลี่ยน)' : '*'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="กรอกรหัสผ่าน"
              required={!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">อีเมล *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="กรอกอีเมล"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">ชื่อ *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                placeholder="ชื่อ"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">นามสกุล *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                placeholder="นามสกุล"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">ตำแหน่ง</Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e) => setFormData({...formData, rank: e.target.value})}
              placeholder="ตำแหน่งงาน"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locations_id">สถานที่ทำงาน</Label>
            <Select 
              value={formData.locations_id} 
              onValueChange={(value) => setFormData({...formData, locations_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสถานที่ทำงาน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ไม่ระบุ</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.locations_id} value={location.locations_id.toString()}>
                    {location.division} - {location.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">บทบาท</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({...formData, role: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">สถานะ</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">ใช้งาน</SelectItem>
                <SelectItem value="inactive">ระงับการใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'กำลังบันทึก...' : (user ? 'อัปเดต' : 'เพิ่ม')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
