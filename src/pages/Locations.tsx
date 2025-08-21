import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { apiService } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// 1. กำหนด Type ของข้อมูล Location ให้ชัดเจน
interface Location {
  locations_id: number;
  division: string;
  department: string;
  status: 'active' | 'inactive';
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // เปลี่ยนจาก onSave เป็น onSuccess เพื่อให้ตรงกัน
  location: Location | null;
}

// 2. สร้าง Schema สำหรับ validation ด้วย Zod
const formSchema = z.object({
  division: z.string().min(1, "กรุณากรอกชื่อหน่วยงาน"),
  department: z.string().min(1, "กรุณากรอกชื่อแผนก"),
  status: z.enum(["active", "inactive"]),
});

export default function LocationModal({ isOpen, onClose, onSuccess, location }: LocationModalProps) {
  const isEditMode = !!location;

  // 3. ใช้ react-hook-form ในการจัดการฟอร์ม
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      division: "",
      department: "",
      status: "active",
    },
  });

  // 4. ตั้งค่าข้อมูลในฟอร์มเมื่อ prop `location` เปลี่ยนแปลง
  useEffect(() => {
    if (location) {
      form.reset(location);
    } else {
      form.reset({
        division: "",
        department: "",
        status: "active",
      });
    }
  }, [location, form]);

  // 5. ฟังก์ชันสำหรับ Submit ฟอร์ม
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode) {
        // โหมดแก้ไข: เรียกใช้ updateLocation
        await apiService.updateLocation(location.locations_id.toString(), values);
        toast.success("อัปเดตข้อมูลสถานที่สำเร็จ");
      } else {
        // โหมดสร้างใหม่: เรียกใช้ createLocation
        await apiService.createLocation(values);
        toast.success("เพิ่มสถานที่ใหม่สำเร็จ");
      }
      onSuccess(); // เรียกเพื่อให้หน้าหลัก (LocationsPage) โหลดข้อมูลใหม่
      onClose();   // ปิด Modal
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "แก้ไขสถานที่" : "เพิ่มสถานที่ใหม่"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หน่วยงาน *</FormLabel>
                  <FormControl>
                    <Input placeholder="เช่น ฝ่ายเทคโนโลยีสารสนเทศ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>แผนก *</FormLabel>
                  <FormControl>
                    <Input placeholder="เช่น แผนกพัฒนาระบบ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สถานะ</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectItem value="active">ใช้งาน</SelectItem>
                       <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                     </SelectContent>
                   </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>ยกเลิก</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'กำลังบันทึก...' : (isEditMode ? 'อัปเดต' : 'เพิ่ม')}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}