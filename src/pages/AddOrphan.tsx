import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddOrphan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    region: '',
    story: '',
    needs: '',
    imageUrl: '',
    status: 'active'
  });

  const ethiopianRegions = [
    'Addis Ababa',
    'Tigray',
    'Amhara',
    'Oromia',
    'Somali',
    'Afar',
    'Sidama',
    'SNNPR',
    'Benishangul-Gumuz',
    'Gambela',
    'Harari',
    'Dire Dawa'
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getFirestore();
      const orphansRef = collection(db, 'orphans');

      await addDoc(orphansRef, {
        ...formData,
        age: parseInt(formData.age),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Orphan profile created successfully!', {
        description: `${formData.name} has been added to the system.`
      });

      navigate('/admin');
    } catch (error: any) {
      console.error('Error adding orphan:', error);
      toast.error('Failed to create orphan profile', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
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
            <h1 className="text-4xl font-bold text-foreground">Add New Orphan</h1>
            <p className="text-muted-foreground">Create a new orphan profile in the system</p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Orphan Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter child's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="18"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleChange('gender', value)}
                    required
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Ethiopian Region *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleChange('region', value)}
                    required
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethiopianRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-2">
                <Label htmlFor="story">Child's Story *</Label>
                <Textarea
                  id="story"
                  value={formData.story}
                  onChange={(e) => handleChange('story', e.target.value)}
                  placeholder="Share the child's background and story..."
                  rows={4}
                  required
                />
              </div>

              {/* Needs */}
              <div className="space-y-2">
                <Label htmlFor="needs">Current Needs *</Label>
                <Textarea
                  id="needs"
                  value={formData.needs}
                  onChange={(e) => handleChange('needs', e.target.value)}
                  placeholder="Describe what support the child needs (education, healthcare, etc.)..."
                  rows={3}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Profile Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to a profile photo. Leave blank to use default placeholder.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                  required
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active - Seeking Support</SelectItem>
                    <SelectItem value="sponsored">Sponsored</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Orphan Profile
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/admin')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddOrphan;
