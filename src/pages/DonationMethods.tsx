import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Copy, Check, Building2, Smartphone, CreditCard, Upload, Image as ImageIcon, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'mobile';
  accountNumber: string;
  accountName?: string;
  icon: any;
  color: string;
}

const DonationMethods = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    amount: '',
    transactionId: '',
    paymentMethod: '',
    notes: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cbe',
      name: 'Commercial Bank of Ethiopia (CBE)',
      type: 'bank',
      accountNumber: '12345678',
      accountName: 'Ummah Orphan Care',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      id: 'awash',
      name: 'Awash International Bank',
      type: 'bank',
      accountNumber: '123456789',
      accountName: 'Ummah Orphan Care',
      icon: Building2,
      color: 'bg-green-500'
    },
    {
      id: 'hijra',
      name: 'Hijra Bank',
      type: 'bank',
      accountNumber: '123456789',
      accountName: 'Ummah Orphan Care',
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      id: 'telebirr',
      name: 'TeleBirr (Ethio Telecom)',
      type: 'mobile',
      accountNumber: '0911111111',
      icon: Smartphone,
      color: 'bg-orange-500'
    }
  ];

  const copyToClipboard = (text: string, id: string, name: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success(`${name} account number copied!`);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadReceipt = async () => {
    if (!receiptFile) {
      toast.error('Please select a receipt image');
      return;
    }

    if (!formData.amount || !formData.paymentMethod) {
      toast.error('Please fill in amount and payment method');
      return;
    }

    if (!userData?.id) {
      toast.error('Please login to submit receipt');
      return;
    }

    setUploading(true);
    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `receipts/${userData.id}/${timestamp}_${receiptFile.name}`);
      
      await uploadBytes(storageRef, receiptFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Save receipt data to Firestore
      const db = getFirestore();
      await addDoc(collection(db, 'paymentReceipts'), {
        donorId: userData.id,
        donorEmail: userData.email,
        donorName: userData.displayName || 'Anonymous',
        amount: parseFloat(formData.amount),
        transactionId: formData.transactionId,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        receiptUrl: downloadURL,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      toast.success('Receipt uploaded successfully!', {
        description: 'We will verify your payment and confirm within 24 hours.'
      });

      // Reset form
      setIsUploadDialogOpen(false);
      setReceiptFile(null);
      setReceiptPreview('');
      setFormData({
        amount: '',
        transactionId: '',
        paymentMethod: '',
        notes: ''
      });
    } catch (error: any) {
      console.error('Error uploading receipt:', error);
      toast.error('Failed to upload receipt', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Donation Methods</h1>
            <p className="text-muted-foreground">
              የልገሳ መንገዶች - Choose your preferred payment method
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">How to Donate</h3>
                <p className="text-sm text-muted-foreground">
                  Transfer your donation to any of the accounts below. After making the transfer, 
                  please keep your receipt and contact us to confirm your donation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Bank Accounts
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {paymentMethods.filter(m => m.type === 'bank').map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">Bank Transfer</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {method.accountName && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Account Name</p>
                        <p className="text-sm font-semibold">{method.accountName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Account Number</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-lg font-mono font-bold">
                          {method.accountNumber}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(method.accountNumber, method.id, method.name)}
                        >
                          {copiedId === method.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mobile Money */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Mobile Money
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {paymentMethods.filter(m => m.type === 'mobile').map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">Mobile Transfer</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Phone Number</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-lg font-mono font-bold">
                          {method.accountNumber}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(method.accountNumber, method.id, method.name)}
                        >
                          {copiedId === method.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>How to send:</strong> Open TeleBirr app → Send Money → Enter the number above → Enter amount → Confirm
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Upload Receipt Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Payment Receipt
            </CardTitle>
            <CardDescription>
              After making your payment, upload your receipt for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Submit Your Receipt</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload a screenshot or photo of your payment receipt for quick verification
              </p>
              <Button onClick={() => setIsUploadDialogOpen(true)} size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>After Making Your Donation</CardTitle>
            <CardDescription>Important steps to complete your donation</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <strong>Keep your receipt:</strong> Save the transaction receipt or screenshot from your bank/mobile app
              </li>
              <li className="text-sm">
                <strong>Upload receipt:</strong> Use the upload button above to submit your receipt for verification
              </li>
              <li className="text-sm">
                <strong>Specify purpose:</strong> Let us know if you want to support a specific orphan or general fund
              </li>
              <li className="text-sm">
                <strong>Get confirmation:</strong> We'll verify and confirm your donation within 24 hours
              </li>
            </ol>
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium mb-2">Contact Information:</p>
              <p className="text-sm text-muted-foreground">Email: donations@ummahorphancare.org</p>
              <p className="text-sm text-muted-foreground">Phone: +251 911 111 111</p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Receipt Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Payment Receipt</DialogTitle>
              <DialogDescription>
                Please provide your payment details and upload the receipt
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Paid (ብር) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <select
                    id="paymentMethod"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                  >
                    <option value="">Select method</option>
                    <option value="CBE">CBE Bank</option>
                    <option value="Awash">Awash Bank</option>
                    <option value="Hijra">Hijra Bank</option>
                    <option value="TeleBirr">TeleBirr</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  placeholder="e.g., TXN123456789"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or specific orphan you want to support..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt">Upload Receipt Image *</Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, PDF
                </p>
              </div>

              {receiptPreview && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setReceiptFile(null);
                  setReceiptPreview('');
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button onClick={uploadReceipt} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Receipt
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DonationMethods;
