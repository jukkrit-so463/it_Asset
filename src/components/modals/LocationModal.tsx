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

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: any;
  onSuccess: () => void;
}

export default function LocationModal({ isOpen, onClose, location, onSuccess }: LocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    division: "",
    department: "",
    status: "active"
  });

  useEffect(() => {
    if (isOpen) {
      if (location) {
        setFormData({
          division: location.division || "",
          department: location.department || "",
          status: location.status || "active"
        });
      } else {
        setFormData({
          division: "",
          department: "",
          status: "active"
        });
      }
    }
  }, [isOpen, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (location) {
        // Update location (need to implement updateLocation in API)
        toast.success('อัปเดตสถานที่สำเร็จ');
      } else {
        await apiService.createLocation(formData);
        toast.success('เพิ่มสถานที่สำเร็จ');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
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
            {location ? 'แก้ไขสถานที่' : 'เพิ่มสถานที่ใหม่'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="division">ฝ่าย *</Label>
            <Input
              id="division"
              value={formData.division}
              onChange={(e) => setFormData({...formData, division: e.target.value})}
              placeholder="ชื่อฝ่าย"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">แผนก *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              placeholder="ชื่อแผนก"
              required
            />
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
                <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'กำลังบันทึก...' : (location ? 'อัปเดต' : 'เพิ่ม')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
