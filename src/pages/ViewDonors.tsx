import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Loader2, Users, Mail, Calendar, Download, Filter, DollarSign, Heart } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Donor {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: any;
  stripeCustomerId?: string;
  donationCount?: number;
  totalDonated?: number;
}

const ViewDonors = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    let filtered = [...donors];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(donor => donor.role === roleFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case 'oldest':
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case 'name':
          return (a.displayName || a.email).localeCompare(b.displayName || b.email);
        case 'donations':
          return (b.totalDonated || 0) - (a.totalDonated || 0);
        default:
          return 0;
      }
    });

    setFilteredDonors(filtered);
  }, [searchTerm, donors, roleFilter, sortBy]);

  const fetchDonors = async () => {
    try {
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const donorsList: Donor[] = [];
      
      // Fetch donation stats for each donor
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Get donation count and total for this donor
        const donationsRef = collection(db, 'donations');
        const donorDonationsQuery = query(donationsRef, where('donorId', '==', doc.id));
        const donationsSnapshot = await getDocs(donorDonationsQuery);
        
        let totalDonated = 0;
        donationsSnapshot.forEach((donationDoc) => {
          const donationData = donationDoc.data();
          if (donationData.status === 'active' || donationData.status === 'completed') {
            totalDonated += donationData.amount || 0;
          }
        });

        donorsList.push({
          id: doc.id,
          ...data,
          donationCount: donationsSnapshot.size,
          totalDonated
        } as Donor);
      }

      setDonors(donorsList);
      setFilteredDonors(donorsList);
    } catch (error: any) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Joined Date', 'Total Donated', 'Donation Count'];
    const rows = filteredDonors.map(donor => [
      donor.displayName || 'Anonymous',
      donor.email,
      donor.role,
      formatDate(donor.createdAt),
      `${donor.totalDonated || 0}`,
      `${donor.donationCount || 0}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donors-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Donors exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading donors...</p>
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
              <h1 className="text-4xl font-bold text-foreground">All Donors</h1>
              <p className="text-muted-foreground">
                {filteredDonors.length} {filteredDonors.length === 1 ? 'donor' : 'donors'} registered
              </p>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donors.length}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ብር {donors.reduce((sum, d) => sum + (d.totalDonated || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {donors.filter(d => (d.donationCount || 0) > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">With donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="donations">Most Donations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredDonors.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Donors Yet</h3>
              <p className="text-muted-foreground">
                Donors will appear here once they register on the platform.
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredDonors.length === 0 && searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No donors match your search "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Donors List */}
        {filteredDonors.length > 0 && (
          <div className="space-y-4">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {donor.displayName || 'Anonymous Donor'}
                          </h3>
                          <Badge variant={donor.role === 'admin' ? 'default' : 'secondary'}>
                            {donor.role}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{donor.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {formatDate(donor.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Donated: ብር {(donor.totalDonated || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>{donor.donationCount || 0} {(donor.donationCount || 0) === 1 ? 'donation' : 'donations'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDonors;
