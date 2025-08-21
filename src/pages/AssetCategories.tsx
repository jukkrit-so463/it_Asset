import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Plus,
  Edit,
  Trash2,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import CategoryModal from "@/components/modals/CategoryModal";

interface Category {
  category_id: number;
  code: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AssetCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err: any) {
      toast.error(err.message || 'โหลดประเภทครุภัณฑ์ล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await apiService.deleteCategory(categoryToDelete.category_id.toString());
      toast.success('ลบประเภทสำเร็จ');
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || 'ลบประเภทล้มเหลว');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const confirmClear = async () => {
    try {
      await apiService.clearCategories();
      toast.success('เคลียร์ประเภททั้งหมดแล้ว');
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || 'เคลียร์ประเภทล้มเหลว');
    } finally {
      setClearDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการประเภทครุภัณฑ์</h1>
          <p className="text-muted-foreground text-sm sm:text-base">กำหนดประเภทและจัดกลุ่มครุภัณฑ์</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setClearDialogOpen(true)} className="gap-2">
            <RotateCcw className="w-4 h-4" /> เคลียร์ทั้งหมด
          </Button>
          <Button className="flex items-center justify-center gap-2" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">เพิ่มประเภท</span>
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">ประเภทครุภัณฑ์ ({categories.length} รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">รหัส</TableHead>
                  <TableHead className="min-w-[150px]">ชื่อประเภท</TableHead>
                  <TableHead className="min-w-[200px]">คำอธิบาย</TableHead>
                  <TableHead className="min-w-[150px]">สถานะ</TableHead>
                  <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.category_id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-warning/10 text-warning">
                        {category.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={category.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                        {category.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(category)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} category={selectedCategory || undefined} onSuccess={loadCategories} />
      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={confirmDelete} title="ยืนยันการลบ" description={`ต้องการลบประเภท ${categoryToDelete?.name} (${categoryToDelete?.code}) ใช่หรือไม่?`} />
      <ConfirmDialog isOpen={clearDialogOpen} onClose={() => setClearDialogOpen(false)} onConfirm={confirmClear} title="ยืนยันการเคลียร์ประเภท" description="ต้องการลบประเภททั้งหมดใช่หรือไม่?" />
    </div>
  );
}