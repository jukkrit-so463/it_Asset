import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  QrCode,
  FileDown,
  Edit,
  Trash2,
  Eye,
  Download,
  RotateCcw
} from "lucide-react";

const assets = [
  {
    id: "COM-2025070001",
    serialNumber: "COM-Patroj",
    name: "Lenovo L13",
    category: "Computer",
    brand: "Dell",
    location: "ชั้นกลัวบอก",
    value: "18,500",
    status: "ใช้งานปกติ",
    owner: "ผู้ดูแลระบบ Factory1",
    repairs: 2,
    qrCode: true
  },
  {
    id: "COM-2025070002", 
    serialNumber: "COM-002",
    name: "HP 450",
    category: "Computer",
    brand: "HP",
    location: "ใช้งานปกติ",
    value: "185,500.00",
    status: "ใช้งานปกติ",
    owner: "ผู้ดูแลระบบ โรงงาน 2",
    repairs: 1,
    qrCode: true
  },
  {
    id: "COM-2025070003",
    serialNumber: "COM-00001", 
    name: "Lenovo L13",
    category: "Computer",
    brand: "Lenovo",
    location: "ใช้งานปกติ",
    value: "30,000.00",
    status: "ใช้งานปกติ",
    owner: "admin01 #22",
    repairs: 1,
    qrCode: false
  }
];

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการครุภัณฑ์</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลครุภัณฑ์ IT ทั้งหมด</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">สแกน QR</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 bg-success text-success-foreground">
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">พิมพ์สติกเกอร์</span>
          </Button>
          <Button className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">เพิ่มครุภัณฑ์</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาผลิต, ซีเรียล, รุ่น, ผู้ใช้งาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="ทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="factory1">โรงงาน 1</SelectItem>
                <SelectItem value="factory2">โรงงาน 2</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-primary text-primary-foreground">
              กรอง
            </Button>
            <Button variant="ghost" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg">รายการครุภัณฑ์ (6 รายการ)</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">พิมพ์</span>
              </Button>
              <Button variant="outline" size="sm" className="bg-success text-success-foreground">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Excel</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            แสดง 10 รายการ - คิม: {assets.length}
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">รหัสครุภัณฑ์</TableHead>
                  <TableHead className="min-w-[150px]">ชื่อครุภัณฑ์</TableHead>
                  <TableHead className="min-w-[100px]">ประเภท</TableHead>
                  <TableHead className="min-w-[120px]">ยี่ห้อ/รุ่น</TableHead>
                  <TableHead className="min-w-[150px]">ผู้ใช้งาน</TableHead>
                  <TableHead className="min-w-[100px]">สถานะ</TableHead>
                  <TableHead className="min-w-[80px]">การซ่อม</TableHead>
                  <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {asset.qrCode ? (
                          <div className="w-8 h-8 border-2 border-gray-400 flex items-center justify-center text-xs">
                            QR
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <QrCode className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate">{asset.id}</div>
                          <div className="text-sm text-muted-foreground truncate">S/N: {asset.serialNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px]">
                      <div className="truncate">{asset.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-info/10 text-info">
                        {asset.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[120px]">
                        <div className="truncate">{asset.brand}</div>
                        <div className="text-sm text-muted-foreground truncate">{asset.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-[150px] truncate">{asset.owner}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-warning/10 text-warning">
                        {asset.repairs}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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