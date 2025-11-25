import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Loader2, DollarSign, Calendar, User, Heart, Download, Filter, TrendingUp } from 'lucide-react';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Donation {
  id: string;
  donorId: string;
  orphanId: string;
  amount: number;
  currency: string;
  type: 'one-time' | 'recurring';
  status: 'active' | 'cancelled' | 'completed';
  createdAt: any;
  donorName?: string;
  orphanName?: string;
}

const ViewDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    let filtered = [...donations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.orphanName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(donation => donation.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case 'oldest':
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredDonations(filtered);
  }, [searchTerm, donations, typeFilter, statusFilter, sortBy]);

  const fetchDonations = async () => {
    try {
      const db = getFirestore();
      const donationsRef = collection(db, 'donations');
      const q = query(donationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const donationsList: Donation[] = [];
      let total = 0;

      for (const donationDoc of querySnapshot.docs) {
        const data = donationDoc.data();
        
        // Fetch donor name
        let donorName = 'Unknown Donor';
        try {
          const donorDoc = await getDoc(doc(db, 'users', data.donorId));
          if (donorDoc.exists()) {
            donorName = donorDoc.data().displayName || donorDoc.data().email;
          }
        } catch (error) {
          console.error('Error fetching donor:', error);
        }

        // Fetch orphan name
        let orphanName = 'Unknown Orphan';
        try {
          const orphanDoc = await getDoc(doc(db, 'orphans', data.orphanId));
          if (orphanDoc.exists()) {
            orphanName = orphanDoc.data().name;
          }
        } catch (error) {
          console.error('Error fetching orphan:', error);
        }

        const donation = {
          id: donationDoc.id,
          ...data,
          donorName,
          orphanName
        } as Donation;

        donationsList.push(donation);
        
        if (donation.status === 'active' || donation.status === 'completed') {
          total += donation.amount;
        }
      }

      setDonations(donationsList);
      setFilteredDonations(donationsList);
      setTotalAmount(total);
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations', {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'recurring' 
      ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      : 'bg-orange-100 text-orange-800 hover:bg-orange-100';
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Donor', 'Orphan', 'Amount', 'Currency', 'Type', 'Status'];
    const rows = filteredDonations.map(donation => [
      formatDate(donation.createdAt),
      donation.donorName || 'Unknown',
      donation.orphanName || 'Unknown',
      donation.amount.toString(),
      donation.currency,
      donation.type,
      donation.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Donations exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading donations...</p>
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
              <h1 className="text-4xl font-bold text-foreground">All Donations</h1>
              <p className="text-muted-foreground">
                {filteredDonations.length} {filteredDonations.length === 1 ? 'donation' : 'donations'} recorded
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
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ብር {totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ethiopian Birr</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Count</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donations.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recurring</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {donations.filter(d => d.type === 'recurring' && d.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Monthly subscriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by donor or orphan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="one-time">One-Time</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Highest Amount</SelectItem>
                  <SelectItem value="amount-low">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredDonations.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Donations Yet</h3>
              <p className="text-muted-foreground">
                Donations will appear here once donors start contributing.
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredDonations.length === 0 && searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No donations match your search "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Donations List */}
        {filteredDonations.length > 0 && (
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            ብር {donation.amount.toLocaleString()} {donation.currency}
                          </h3>
                          <Badge className={getTypeColor(donation.type)}>
                            {donation.type}
                          </Badge>
                          <Badge className={getStatusColor(donation.status)}>
                            {donation.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Donor: {donation.donorName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>Orphan: {donation.orphanName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Date: {formatDate(donation.createdAt)}</span>
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

export default ViewDonations;
