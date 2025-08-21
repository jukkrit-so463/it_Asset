import { useEffect, useState } from "react";
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

// 1. กำหนด Type ของข้อมูลให้ชัดเจน
interface Location {
  locations_id: number;
  division: string;
  department: string;
}

// ทำให้ User type มีความชัดเจนมากขึ้น
interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rank: string;
  locations_id: number;
  role: "user" | "admin";
  status: "active" | "inactive";
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null; // ใช้ User type แทน any
}

// 2. สร้าง Schema สำหรับ validation ด้วย Zod
// โหมด 'edit' จะไม่บังคับรหัสผ่าน
const createUserSchema = z.object({
  username: z.string().min(3, "ชื่อผู้ใช้งานต้องมีอย่างน้อย 3 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  first_name: z.string().min(1, "กรุณากรอกชื่อ"),
  last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
  rank: z.string().optional(),
  locations_id: z.string().min(1, "กรุณาเลือกสถานที่ทำงาน"),
  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "inactive"]),
});

const updateUserSchema = createUserSchema.extend({
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร").or(z.literal("")).optional(),
});


export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const isEditMode = !!user;

  // 3. ใช้ react-hook-form ในการจัดการฟอร์ม
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      rank: "",
      locations_id: "",
      role: "user",
      status: "active",
    },
  });

  // 4. ตั้งค่าข้อมูลในฟอร์มเมื่อ user prop เปลี่ยนแปลง
  useEffect(() => {
    if (isOpen) {
        loadLocations();
        if (user) {
            form.reset({
                ...user,
                locations_id: user.locations_id?.toString() || "",
                password: "", // ไม่ต้องแสดงรหัสผ่านเดิม
            });
        } else {
            form.reset(); // เคลียร์ฟอร์มสำหรับสร้างใหม่
        }
    }
  }, [isOpen, user, form]);

  const loadLocations = async () => {
    try {
      const response = await apiService.getLocations() as ApiResponse<Location[]>;
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error("ไม่สามารถโหลดข้อมูลสถานที่ได้");
    }
  };

  // 5. ฟังก์ชันสำหรับ Submit ฟอร์ม
  const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
    try {
      const submitData = {
        ...values,
        locations_id: parseInt(values.locations_id),
      };

      if (isEditMode) {
        // ถ้าเป็นโหมดแก้ไข และไม่ได้กรอกรหัสผ่านใหม่ ให้ลบ key password ออก
        if (!submitData.password) {
          delete (submitData as any).password;
        }
        await apiService.updateUser(user.user_id.toString(), submitData);
        toast.success("อัปเดตข้อมูลผู้ใช้งานสำเร็จ");
      } else {
        await apiService.createUser(submitData);
        toast.success("เพิ่มผู้ใช้งานใหม่สำเร็จ");
      }
      onSuccess(); // เรียกเพื่อให้หน้าหลักโหลดข้อมูลใหม่
      onClose();   // ปิด Modal
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่"}</DialogTitle>
        </DialogHeader>
        
        {/* 6. ใช้ Component <Form> จาก ShadCN */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อผู้ใช้งาน *</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อผู้ใช้งาน" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสผ่าน {isEditMode ? '(เว้นว่างถ้าไม่เปลี่ยน)' : '*'}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="กรอกรหัสผ่าน" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="กรอกอีเมล" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ *</FormLabel>
                    <FormControl>
                      <Input placeholder="ชื่อ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>นามสกุล *</FormLabel>
                    <FormControl>
                      <Input placeholder="นามสกุล" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
             <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ตำแหน่ง</FormLabel>
                  <FormControl>
                    <Input placeholder="ตำแหน่งงาน" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locations_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สถานที่ทำงาน *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสถานที่ทำงาน" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {locations.map((location) => (
                        <SelectItem key={location.locations_id} value={location.locations_id.toString()}>
                          {location.division} - {location.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>บทบาท</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                         <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                       </SelectContent>
                     </Select>
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
                         <SelectItem value="inactive">ระงับการใช้งาน</SelectItem>
                       </SelectContent>
                     </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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