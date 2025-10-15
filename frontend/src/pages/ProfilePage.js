import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Upload, Package, FileText } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfilePage = () => {
  const { user, token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [uploading, setUploading] = useState(false);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchPrescriptions();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`${API}/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientName', patientName);

    try {
      const response = await axios.post(`${API}/prescriptions`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Prescription uploaded successfully');
      fetchPrescriptions();
      setPatientName('');
    } catch (error) {
      console.error('Failed to upload prescription:', error);
      toast.error('Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  }, [patientName, token]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-accent text-accent-foreground';
      case 'under-review': return 'bg-secondary text-foreground';
      case 'approved': return 'bg-[hsl(161_93%_24%)] text-white';
      case 'rejected': return 'bg-destructive text-white';
      case 'delivered': return 'bg-[hsl(161_93%_24%)] text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-semibold">My Account</h1>
          <p className="mt-2 text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="prescriptions" data-testid="profile-prescriptions-tab">
              <FileText className="h-4 w-4 mr-2" />
              Prescriptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No orders yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="tabular-nums">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="mt-6">
            <Card className="p-6 mb-6">
              <h3 className="font-display text-xl font-semibold mb-4">Upload Prescription</h3>
              <div className="mb-4">
                <Label>Patient Name</Label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div
                {...getRootProps()}
                data-testid="rx-upload-dropzone"
                className="rounded-lg border border-dashed p-8 text-center bg-secondary hover:bg-[hsl(200_20%_93%)] transition-colors cursor-pointer"
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto text-primary mb-2" />
                <p className="font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop prescription or click to upload'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG, PDF</p>
                {uploading && (
                  <div className="mt-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-2 bg-primary rounded-full w-full animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {prescriptions.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No prescriptions uploaded</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <Card key={prescription.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{prescription.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{prescription.fileName}</p>
                        {prescription.pharmacistNotes && (
                          <p className="text-sm mt-2">
                            <span className="font-semibold">Notes: </span>
                            {prescription.pharmacistNotes}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(prescription.status)} data-testid="rx-status-chip">
                        {prescription.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;