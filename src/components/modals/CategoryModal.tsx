import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiService } from "@/services/api";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  onSuccess: () => void;
}

export default function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "active"
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          code: category.code || "",
          name: category.name || "",
          description: category.description || "",
          status: category.status || "active"
        });
      } else {
        setFormData({ code: "", name: "", description: "", status: "active" });
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        await apiService.updateCategory(category.category_id.toString(), formData);
        toast.success('อัปเดตประเภทสำเร็จ');
      } else {
        await apiService.createCategory(formData);
        toast.success('เพิ่มประเภทสำเร็จ');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'เกิดข้อผิดพลาดในการบันทึกประเภท');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'แก้ไขประเภทครุภัณฑ์' : 'เพิ่มประเภทครุภัณฑ์'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">รหัสประเภท *</Label>
            <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required disabled={!!category} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อประเภท *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">คำอธิบาย</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">สถานะ</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">ยกเลิก</Button>
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'กำลังบันทึก...' : (category ? 'อัปเดต' : 'เพิ่ม')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
