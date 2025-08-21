import { useState, useEffect } from "react";
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
  RotateCcw,
  Loader2
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import AssetModal from "@/components/modals/AssetModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

interface Asset {
  device_id: number;
  service_tag: string;
  device_type: string;
  user_id?: number;
  locations_id?: number;
  date_received?: string;
  operational_status: string;
  first_name?: string;
  last_name?: string;
  division?: string;
  department?: string;
  ip_address?: string;
  created_at: string;
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssets();
      setAssets(response.data);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลครุภัณฑ์');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setAssetModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetModalOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;

    try {
      await apiService.deleteAsset(assetToDelete.device_id.toString());
      toast.success('ลบครุภัณฑ์สำเร็จ');
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('เกิดข้อผิดพลาดในการลบครุภัณฑ์');
    } finally {
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  const handleModalSuccess = () => {
    loadAssets();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการครุภัณฑ์</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลครุภัณฑ์ IT ทั้งหมด</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={() => toast.info('ฟีเจอร์สแกน QR จะเปิดใช้งานเร็วๆ นี้')}
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">สแกน QR</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 bg-success text-success-foreground"
            onClick={() => toast.info('ฟีเจอร์พิมพ์สติกเกอร์จะเปิดใช้งานเร็วๆ นี้')}
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">พิมพ์สติกเกอร์</span>
          </Button>
          <Button className="flex items-center justify-center gap-2" onClick={handleAddAsset}>
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
            <Button 
              variant="outline" 
              className="bg-primary text-primary-foreground"
              onClick={() => toast.info('ฟีเจอร์กรองข้อมูลจะเปิดใช้งานเร็วๆ นี้')}
            >
              กรอง
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("all");
                toast.success('รีเซ็ตการกรองแล้ว');
              }}
            >
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('ฟีเจอร์พิมพ์รายงานจะเปิดใช้งานเร็วๆ นี้')}
              >
                <FileDown className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">พิมพ์</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-success text-success-foreground"
                onClick={() => toast.info('ฟีเจอร์ส่งออก Excel จะเปิดใช้งานเร็วๆ นี้')}
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Excel</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            แสดง {assets.length} รายการ
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">รหัสครุภัณฑ์</TableHead>
                    <TableHead className="min-w-[150px]">ประเภท</TableHead>
                    <TableHead className="min-w-[120px]">Service Tag</TableHead>
                    <TableHead className="min-w-[150px]">ผู้ใช้งาน</TableHead>
                    <TableHead className="min-w-[150px]">สถานที่</TableHead>
                    <TableHead className="min-w-[100px]">สถานะ</TableHead>
                    <TableHead className="min-w-[100px]">IP Address</TableHead>
                    <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.device_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">DEV-{asset.device_id.toString().padStart(6, '0')}</div>
                            <div className="text-sm text-muted-foreground truncate">ID: {asset.device_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-info/10 text-info">
                          {asset.device_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[150px]">
                        <div className="truncate">{asset.service_tag || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-[150px] truncate">
                          {asset.first_name && asset.last_name 
                            ? `${asset.first_name} ${asset.last_name}`
                            : 'ไม่ระบุ'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[120px]">
                          <div className="truncate">{asset.division || '-'}</div>
                          <div className="text-sm text-muted-foreground truncate">{asset.department || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            asset.operational_status === 'active' 
                              ? 'bg-success/10 text-success'
                              : asset.operational_status === 'in_repair'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-destructive/10 text-destructive'
                          }
                        >
                          {asset.operational_status === 'active' ? 'ใช้งานปกติ' :
                           asset.operational_status === 'in_repair' ? 'กำลังซ่อม' :
                           asset.operational_status === 'decommissioned' ? 'ชำรุด' : asset.operational_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {asset.ip_address || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toast.info(`ดูรายละเอียดครุภัณฑ์ ${asset.device_type} (ID: ${asset.device_id})`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditAsset(asset)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteAsset(asset)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AssetModal
        isOpen={assetModalOpen}
        onClose={() => setAssetModalOpen(false)}
        asset={selectedAsset}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="ยืนยันการลบ"
        description={`คุณต้องการลบครุภัณฑ์ ${assetToDelete?.device_type} (ID: ${assetToDelete?.device_id}) ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
      />
    </div>
  );
}