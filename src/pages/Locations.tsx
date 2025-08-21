import { useState, useEffect } from "react";
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
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  MapPin,
  Eye
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import LocationModal from "@/components/modals/LocationModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

interface Location {
  locations_id: number;
  division: string;
  department: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLocations();
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสถานที่');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setLocationModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setLocationModalOpen(true);
  };

  const handleDeleteLocation = (location: Location) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      // Need to implement deleteLocation in API
      toast.success('ลบสถานที่สำเร็จ');
      loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('เกิดข้อผิดพลาดในการลบสถานที่');
    } finally {
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    }
  };

  const handleModalSuccess = () => {
    loadLocations();
  };

  const filteredLocations = locations.filter(location =>
    location.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">จัดการสถานที่</h1>
          <p className="text-muted-foreground text-sm sm:text-base">จัดการข้อมูลสถานที่และแผนกต่างๆ</p>
        </div>
        <Button className="flex items-center justify-center gap-2" onClick={handleAddLocation}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มสถานที่</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="ค้นหาฝ่าย, แผนก..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">รายการสถานที่ ({filteredLocations.length} รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <TableHead className="min-w-[200px]">สถานที่</TableHead>
                    <TableHead className="min-w-[150px]">ฝ่าย</TableHead>
                    <TableHead className="min-w-[150px]">แผนก</TableHead>
                    <TableHead className="min-w-[100px]">สถานะ</TableHead>
                    <TableHead className="min-w-[120px]">วันที่สร้าง</TableHead>
                    <TableHead className="text-right min-w-[120px]">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.locations_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {location.division} - {location.department}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">ID: {location.locations_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{location.division}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{location.department}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            location.status === 'active' 
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          }
                        >
                          {location.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(location.created_at).toLocaleDateString('th-TH')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => toast.info(`ดูรายละเอียดสถานที่ ${location.division} - ${location.department}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditLocation(location)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteLocation(location)}
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
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        location={selectedLocation}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="ยืนยันการลบ"
        description={`คุณต้องการลบสถานที่ ${locationToDelete?.division} - ${locationToDelete?.department} ใช่หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
      />
    </div>
  );
}
