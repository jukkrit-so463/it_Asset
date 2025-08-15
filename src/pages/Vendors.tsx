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
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit
} from "lucide-react";

const vendors = [
  {
    name: "2beshop",
    status: "ใช้งาน",
    contact: {
      person: "BUGpairoj",
      phone: "0834567890", 
      email: "acb@gmail.com",
      address: "120/365"
    },
    assets: "1 รายการ",
    value: "15,000 ฿",
    lastOrder: "ซื้อล่าสุด 27 กรกฎาคม 2568"
  },
  {
    name: "2T Solution", 
    status: "ใช้งาน",
    contact: {
      person: "-",
      phone: "-",
      email: "-", 
      address: "-"
    },
    assets: "1 รายการ",
    value: "30,000 ฿",
    lastOrder: "ซื้อล่าสุด 18 ธันวาคม 2537"
  },
  {
    name: "Addin",
    status: "ใช้งาน", 
    contact: {
      person: "0812345678",
      phone: "acb@gmail.com",
      email: "12",
      address: ""
    },
    assets: "2 รายการ",
    value: "18,800 ฿",
    lastOrder: "มูลค่ารวม 3 สินค้าเดือน 2568"
  }
];

export default function Vendors() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการผู้จำหน่าย</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลผู้จำหน่ายและผู้ให้บริการ</p>
        </div>
        <Button className="flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มผู้จำหน่าย</span>
        </Button>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {vendors.map((vendor, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {vendor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.contact.address}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">ครุภัณฑ์</div>
                  <div className="font-medium text-info">{vendor.assets}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">มูลค่ารวม</div>
                  <div className="font-medium text-success">{vendor.value}</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                {vendor.lastOrder}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="sm" className="flex-1 bg-info/10 text-info">
                  <Eye className="w-4 h-4 mr-2" />
                  ดูรายละเอียด
                </Button>
                <Button variant="outline" size="sm" className="bg-warning/10 text-warning">
                  <Edit className="w-4 h-4" />
                  แก้ไข
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}