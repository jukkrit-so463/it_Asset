import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Computer,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Package,
  Users,
  FileText,
  Settings
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">ภาพรวมระบบจัดการครุภัณฑ์ IT</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="ครุภัณฑ์ทั้งหมด"
          value="1"
          icon={Computer}
          variant="primary"
        />
        <StatCard
          title="ใช้งานปกติ"
          value="1"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="กำลังซ่อม"
          value="0"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="ชำรุด"
          value="0"
          icon={XCircle}
          variant="destructive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Asset Categories Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">ครุภัณฑ์แยกตามประเภท</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <Package className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm sm:text-base">กราฟแสดงประเภทครุภัณฑ์</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Asset Value Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">มูลค่าครุภัณฑ์รายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm sm:text-base">กราฟแสดงมูลค่ารายเดือน</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">การดำเนินการด่วน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">ตั้งค่าระบบ</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">จัดการการตั้งค่าทั่วไป</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">Backup Database</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">สำรองข้อมูลฐานข้อมูล</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">Login Logs</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">ประวัติการเข้าใช้งาน</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">การแจ้งเตือน</p>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">ตั้งค่าการแจ้งเตือนระบบ</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}