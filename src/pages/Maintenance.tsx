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
  FileDown,
  Edit,
  Trash2,
  Eye,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench
} from "lucide-react";

const maintenanceRequests = [
  {
    id: "01/08/2025",
    time: "06:44 น",
    assetCode: "COH-00001",
    assetName: "COM-2025070003 | lenovo L13",
    issue: "ต้องการติดตั้งโปรแกรมเพิ่มเติม",
    requester: "Ww",
    cost: "123",
    status: "ซ่อมเรียบร้อย",
    statusColor: "success"
  },
  {
    id: "04/08/2025", 
    time: "21:43 น",
    assetCode: "Note เครื่องที่ 2",
    assetName: "NB-2025070001 | Dell ddd",
    issue: "test3",
    requester: "test3",
    cost: "5,200",
    status: "ซ่อมเรียบร้อย",
    statusColor: "success"
  }
];

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("สิงหาคม 2025");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

  const getStatusCounts = () => {
    return {
      pending: 1,
      inProgress: 0, 
      completed: 2,
      cancelled: 3,
      urgent: 1
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">ระบบซ่อมบำรุง</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลการซ่อมบำรุงครุภัณฑ์ IT</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" className="bg-success text-success-foreground">
            <FileDown className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export Excel</span>
          </Button>
          <Button className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">บันทึกการซ่อม</span>
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-full mx-auto mb-2">
              <X className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-2xl font-bold text-destructive">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">รอดำเนินการ</div>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div className="text-2xl font-bold text-warning">{statusCounts.inProgress}</div>
            <div className="text-sm text-muted-foreground">กำลังซ่อม</div>
          </CardContent>
        </Card>

        <Card className="border-info/20 bg-info/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-info/10 rounded-full mx-auto mb-2">
              <Clock className="w-6 h-6 text-info" />
            </div>
            <div className="text-2xl font-bold text-info">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">รอตรวจสอบ</div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-success">{statusCounts.cancelled}</div>
            <div className="text-sm text-muted-foreground">ซ่อมเรียบร้อย</div>
          </CardContent>
        </Card>

        <Card className="border-muted/20 bg-muted/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-muted/10 rounded-full mx-auto mb-2">
              <Wrench className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-muted-foreground">{statusCounts.urgent}</div>
            <div className="text-sm text-muted-foreground">ยกเลิก</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหารหัส, ชื่อครุภัณฑ์, อาการ, ผู้แจ้ง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="สิงหาคม 2025">สิงหาคม 2025</SelectItem>
                <SelectItem value="กรกฎาคม 2025">กรกฎาคม 2025</SelectItem>
                <SelectItem value="มิถุนายน 2025">มิถุนายน 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                <SelectItem value="รอดำเนินการ">รอดำเนินการ</SelectItem>
                <SelectItem value="กำลังซ่อม">กำลังซ่อม</SelectItem>
                <SelectItem value="ซ่อมเรียบร้อย">ซ่อมเรียบร้อย</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-primary text-primary-foreground">
              กรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการซ่อมบำรุง (2 รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            แสดง 10 รายการ - คิม: {maintenanceRequests.length}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>รหัสครุภัณฑ์</TableHead>
                  <TableHead>อาการ/ปัญหา</TableHead>
                  <TableHead>ผู้แจ้ง</TableHead>
                  <TableHead>ค่าใช้จ่าย</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.id}</div>
                        <div className="text-sm text-muted-foreground">{request.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.assetCode}</div>
                        <div className="text-sm text-muted-foreground">{request.assetName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.issue}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>{request.cost}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
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