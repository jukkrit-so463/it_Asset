import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const users = [
  {
    id: 1,
    username: "admin01",
    email: "admin01@gmail.com",
    fullName: "@admin01",
    role: "Admin",
    status: "ใช้งาน",
    lastLogin: "ออนไลน์ตอนนี้",
    avatar: "A"
  },
  {
    id: 2, 
    username: "staff01",
    email: "staff01@gmail.com",
    fullName: "@staff01",
    role: "Staff",
    status: "ใช้งาน",
    lastLogin: "31/07/2025 06:07",
    avatar: "S"
  },
  {
    id: 3,
    username: "user01", 
    email: "user01@gmail.com",
    fullName: "@user01",
    role: "User",
    status: "ใช้งาน",
    lastLogin: "30/07/2025 15:26",
    avatar: "U"
  }
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลผู้ใช้งานในระบบ</p>
        </div>
        <Button className="flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มผู้ใช้งาน</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="ผู้ใช้ทั้งหมด"
          value="4"
          icon={UsersIcon}
          variant="info"
        />
        <StatCard
          title="ใช้งาน"
          value="4"
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="ระงับการใช้งาน"
          value="0"
          icon={UserX}
          variant="destructive"
        />
        <StatCard
          title="ผู้ดูแลระบบ"
          value="2"
          icon={UserPlus}
          variant="info"
        />
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">รายการผู้ใช้งาน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาชื่อ, อีเมล, บทบาท, ผู้ใช้งาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              แสดง 10 รายการ - คิม: {users.length}
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">ผู้ใช้งาน</TableHead>
                  <TableHead className="min-w-[200px]">อีเมล</TableHead>
                  <TableHead className="min-w-[100px]">บทบาท</TableHead>
                  <TableHead className="min-w-[150px]">ครั้งล่าสุด</TableHead>
                  <TableHead className="min-w-[100px]">สถานะ</TableHead>
                  <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{user.username}</div>
                          <div className="text-sm text-muted-foreground truncate">{user.fullName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Admin" ? "destructive" : user.role === "Staff" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-[150px] truncate">{user.lastLogin}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        {user.status}
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