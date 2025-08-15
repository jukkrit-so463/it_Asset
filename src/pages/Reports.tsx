import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Computer,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileDown,
  Printer
} from "lucide-react";

export default function Reports() {
  const [startDate, setStartDate] = useState("01/08/2025");
  const [endDate, setEndDate] = useState("31/08/2025");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">รายงาน</h1>
        <p className="text-muted-foreground text-sm sm:text-base">รายงานและสถิติต่างๆ ของระบบครุภัณฑ์</p>
      </div>

      {/* Report Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border">
        <Badge variant="default" className="bg-primary text-primary-foreground">
          สรุปภาพรวม
        </Badge>
        <Badge variant="outline">
          แยกตามประเภท
        </Badge>
        <Badge variant="outline">
          แยกตามสถานะ
        </Badge>
        <Badge variant="outline">
          การซ่อมบำรุง
        </Badge>
        <Badge variant="outline">
          ค่าเสื่อมราคา
        </Badge>
        <Badge variant="outline">
          การรับประกัน
        </Badge>
      </div>

      {/* Date Range */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium">วันที่เริ่มต้น</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium">วันที่สิ้นสุด</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <Button className="bg-primary text-primary-foreground">
              ตรวจสอบข้อมูล
            </Button>
            <Button variant="outline" className="bg-success text-success-foreground">
              <FileDown className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export Excel</span>
            </Button>
            <Button variant="outline" className="bg-info text-info-foreground">
              <Printer className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">พิมพ์รายงาน</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="ครุภัณฑ์ทั้งหมด"
          value="3"
          subtitle="รายการ"
          icon={Computer}
          variant="primary"
        />
        <StatCard
          title="มูลค่ารวม"
          value="415,300.00 บาท"
          subtitle="บาท"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="ใช้งานปกติ"
          value="0"
          subtitle="รายการ"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="ต้องซ่อม/ชำรุด"
          value="0"
          subtitle="รายการ"
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Value Chart */}
        <Card>
          <CardHeader>
            <CardTitle>มูลค่าครุภัณฑ์แยกตามประเภท</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span>Computer</span>
                </div>
                <span className="font-medium">234,000 บาท</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span>Notebook</span>
                </div>
                <span className="font-medium">181,300 บาท</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span>Other</span>
                </div>
                <span className="font-medium">0 บาท</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>สถานะครุภัณฑ์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span>ใช้งานปกติ</span>
                </div>
                <span className="font-medium">6 รายการ</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span>ซ่อมบำรุง</span>
                </div>
                <span className="font-medium">0 รายการ</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-destructive rounded"></div>
                  <span>ชำรุด</span>
                </div>
                <span className="font-medium">0 รายการ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>แนวโน้มรายเดือน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">กราฟแสดงแนวโน้มการใช้งานรายเดือน</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}