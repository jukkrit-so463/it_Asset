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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiService } from "@/services/api";

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: any;
  onSuccess: () => void;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
}

interface Location {
  locations_id: number;
  division: string;
  department: string;
}

export default function AssetModal({ isOpen, onClose, asset, onSuccess }: AssetModalProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    device_type: "",
    service_tag: "",
    user_id: "",
    locations_id: "",
    date_received: "",
    operational_status: "active"
  });

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      loadLocations();
      if (asset) {
        setFormData({
          device_type: asset.device_type || "",
          service_tag: asset.service_tag || "",
          user_id: asset.user_id?.toString() || "",
          locations_id: asset.locations_id?.toString() || "",
          date_received: asset.date_received || "",
          operational_status: asset.operational_status || "active"
        });
      } else {
        setFormData({
          device_type: "",
          service_tag: "",
          user_id: "",
          locations_id: "",
          date_received: "",
          operational_status: "active"
        });
      }
    }
  }, [isOpen, asset]);

  const loadUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

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
        user_id: formData.user_id ? parseInt(formData.user_id) : null,
        locations_id: formData.locations_id ? parseInt(formData.locations_id) : null
      };

      if (asset) {
        await apiService.updateAsset(asset.device_id.toString(), submitData);
        toast.success('อัปเดตครุภัณฑ์สำเร็จ');
      } else {
        await apiService.createAsset(submitData);
        toast.success('เพิ่มครุภัณฑ์สำเร็จ');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
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
            {asset ? 'แก้ไขครุภัณฑ์' : 'เพิ่มครุภัณฑ์ใหม่'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device_type">ประเภทครุภัณฑ์ *</Label>
            <Select 
              value={formData.device_type} 
              onValueChange={(value) => setFormData({...formData, device_type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทครุภัณฑ์" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer">Computer</SelectItem>
                <SelectItem value="Printer">Printer</SelectItem>
                <SelectItem value="Scanner">Scanner</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
                <SelectItem value="Network Switch">Network Switch</SelectItem>
                <SelectItem value="Router">Router</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_tag">Service Tag</Label>
            <Input
              id="service_tag"
              value={formData.service_tag}
              onChange={(e) => setFormData({...formData, service_tag: e.target.value})}
              placeholder="กรอก Service Tag"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_id">ผู้รับผิดชอบ</Label>
            <Select 
              value={formData.user_id} 
              onValueChange={(value) => setFormData({...formData, user_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ไม่ระบุ</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    {user.first_name} {user.last_name} ({user.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locations_id">สถานที่</Label>
            <Select 
              value={formData.locations_id} 
              onValueChange={(value) => setFormData({...formData, locations_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสถานที่" />
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
            <Label htmlFor="date_received">วันที่รับ</Label>
            <Input
              id="date_received"
              type="date"
              value={formData.date_received}
              onChange={(e) => setFormData({...formData, date_received: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operational_status">สถานะ</Label>
            <Select 
              value={formData.operational_status} 
              onValueChange={(value) => setFormData({...formData, operational_status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">ใช้งานปกติ</SelectItem>
                <SelectItem value="in_repair">กำลังซ่อม</SelectItem>
                <SelectItem value="decommissioned">ชำรุด</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'กำลังบันทึก...' : (asset ? 'อัปเดต' : 'เพิ่ม')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
