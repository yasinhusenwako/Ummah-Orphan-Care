import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Eye, Loader2, Users } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

interface Orphan {
  id: string;
  name: string;
  age: number;
  gender: string;
  region: string;
  story: string;
  needs: string;
  imageUrl?: string;
  status: string;
  createdAt: any;
}

const ViewOrphans = () => {
  const navigate = useNavigate();
  const [orphans, setOrphans] = useState<Orphan[]>([]);
  const [filteredOrphans, setFilteredOrphans] = useState<Orphan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrphans();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = orphans.filter(orphan =>
        orphan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orphan.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrphans(filtered);
    } else {
      setFilteredOrphans(orphans);
    }
  }, [searchTerm, orphans]);

  const fetchOrphans = async () => {
    try {
      const db = getFirestore();
      const orphansRef = collection(db, 'orphans');
      const q = query(orphansRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const orphansList: Orphan[] = [];
      querySnapshot.forEach((doc) => {
        orphansList.push({
          id: doc.id,
          ...doc.data()
        } as Orphan);
      });

      setOrphans(orphansList);
      setFilteredOrphans(orphansList);
    } catch (error: any) {
      console.error('Error fetching orphans:', error);
      toast.error('Failed to load orphans', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'sponsored':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Seeking Support';
      case 'sponsored':
        return 'Sponsored';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orphan profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">All Orphans</h1>
              <p className="text-muted-foreground">
                {filteredOrphans.length} {filteredOrphans.length === 1 ? 'profile' : 'profiles'} found
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/add-orphan')}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Orphan
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredOrphans.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Orphans Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first orphan profile to the system.
              </p>
              <Button onClick={() => navigate('/admin/add-orphan')}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Orphan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredOrphans.length === 0 && searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No orphans match your search "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Orphans Grid */}
        {filteredOrphans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrphans.map((orphan) => (
              <Card key={orphan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                  {orphan.imageUrl ? (
                    <img
                      src={orphan.imageUrl}
                      alt={orphan.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-24 h-24 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(orphan.status)}>
                      {getStatusLabel(orphan.status)}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{orphan.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {orphan.age} yrs
                    </span>
                  </CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{orphan.gender}</Badge>
                    <Badge variant="outline">{orphan.region}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {orphan.story}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/admin/orphan/${orphan.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrphans;
