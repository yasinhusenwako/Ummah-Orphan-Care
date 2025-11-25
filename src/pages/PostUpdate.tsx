import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Upload, Send, Image as ImageIcon } from 'lucide-react';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';

interface Orphan {
  id: string;
  name: string;
}

const PostUpdate = () => {
  const navigate = useNavigate();
  const [orphans, setOrphans] = useState<Orphan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    orphanId: '',
    title: '',
    content: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchOrphans();
  }, []);

  const fetchOrphans = async () => {
    try {
      const db = getFirestore();
      const orphansRef = collection(db, 'orphans');
      const q = query(orphansRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      const orphansList: Orphan[] = [];
      querySnapshot.forEach((doc) => {
        orphansList.push({
          id: doc.id,
          name: doc.data().name
        });
      });

      setOrphans(orphansList);
    } catch (error: any) {
      console.error('Error fetching orphans:', error);
      toast.error('Failed to load orphans');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';

    setUploadingImage(true);
    try {
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `updates/${timestamp}_${imageFile.name}`);
      
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return '';
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orphanId || !formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setSubmitting(false);
          return;
        }
      }

      const db = getFirestore();
      const updatesRef = collection(db, 'orphanUpdates');
      
      await addDoc(updatesRef, {
        orphanId: formData.orphanId,
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: imageUrl || null,
        createdAt: serverTimestamp()
      });

      toast.success('Update posted successfully');
      
      // Reset form
      setFormData({
        orphanId: '',
        title: '',
        content: '',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview('');
      
      // Navigate to manage updates
      setTimeout(() => {
        navigate('/admin/updates');
      }, 1000);
    } catch (error: any) {
      console.error('Error posting update:', error);
      toast.error('Failed to post update', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Post Update</h1>
            <p className="text-muted-foreground">
              Share news and updates about orphans
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Update</CardTitle>
            <CardDescription>
              Post updates to keep donors informed about orphan progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orphan">Select Orphan *</Label>
                <Select
                  value={formData.orphanId}
                  onValueChange={(value) => setFormData({ ...formData, orphanId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an orphan" />
                  </SelectTrigger>
                  <SelectContent>
                    {orphans.map((orphan) => (
                      <SelectItem key={orphan.id} value={orphan.id}>
                        {orphan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Update Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Started School This Month"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Update Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Share details about the orphan's progress, achievements, or needs..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>

              {imagePreview && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  disabled={submitting || uploadingImage}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="flex-1"
                >
                  {submitting || uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadingImage ? 'Uploading...' : 'Posting...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Update
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostUpdate;
