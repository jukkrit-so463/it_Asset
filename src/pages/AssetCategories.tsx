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
  Trash2
} from "lucide-react";

const categories = [
  {
    code: "COM",
    name: "Computer",
    description: "ครุภัณฑ์คอมพิวเตอร์",
    assetCount: "3 รายการ"
  },
  {
    code: "LIC", 
    name: "M365 License",
    description: "จัดการใบอนุญาต",
    assetCount: "0 รายการ"
  },
  {
    code: "NB",
    name: "Notebook", 
    description: "จัดการโน้ตบุ๊ค",
    assetCount: "1 รายการ"
  },
  {
    code: "OTH",
    name: "Other",
    description: "อื่น ๆ",
    assetCount: "0 รายการ"
  },
  {
    code: "PC",
    name: "PC",
    description: "คอมพิวเตอร์ PC",
    assetCount: "0 รายการ"
  },
  {
    code: "PRN",
    name: "Printer",
    description: "เครื่องพิมพ์",
    assetCount: "1 รายการ"
  },
  {
    code: "SER",
    name: "Server", 
    description: "เซิร์ฟเวอร์",
    assetCount: "1 รายการ"
  }
];

export default function AssetCategories() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการประเภทครุภัณฑ์</h1>
          <p className="text-muted-foreground text-sm sm:text-base">กำหนดประเภทและจัดกลุ่มครุภัณฑ์</p>
        </div>
        <Button className="flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มประเภท</span>
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">ประเภทครุภัณฑ์</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">รหัส</TableHead>
                  <TableHead className="min-w-[150px]">ชื่อประเภท</TableHead>
                  <TableHead className="min-w-[200px]">คำอธิบาย</TableHead>
                  <TableHead className="min-w-[150px]">จำนวนครุภัณฑ์</TableHead>
                  <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.code}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-warning/10 text-warning">
                        {category.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        category.assetCount.startsWith("0") 
                          ? "bg-muted text-muted-foreground" 
                          : "bg-info/10 text-info"
                      }>
                        {category.assetCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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
    </div>
  );
}