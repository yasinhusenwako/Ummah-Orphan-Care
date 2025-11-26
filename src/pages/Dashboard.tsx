import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Calendar, TrendingUp, LogOut, Loader2, FileText, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DonorStats {
  totalDonations: number;
  totalAmount: number;
  orphansSupported: number;
  activeSubscriptions: number;
}

interface RecentDonation {
  id: string;
  amount: number;
  type: string;
  status: string;
  orphanName: string;
  createdAt: any;
}

const Dashboard = () => {
  const { userData, isAdmin, isDonor } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DonorStats>({
    totalDonations: 0,
    totalAmount: 0,
    orphansSupported: 0,
    activeSubscriptions: 0
  });
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.id) {
      fetchDonorData();
    }
  }, [userData?.id]);

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (userData?.role === 'admin') {
      navigate('/admin');
    }
  }, [userData?.role, navigate]);

  const fetchDonorData = async () => {
    if (!userData?.id) return;

    try {
      const db = getFirestore();
      
      // Fetch donations for this donor
      const donationsQuery = query(
        collection(db, 'donations'),
        where('donorId', '==', userData.id),
        orderBy('createdAt', 'desc'),
        limit(10) // Only fetch recent 10 donations
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      
      let totalAmount = 0;
      let activeSubscriptions = 0;
      const orphanIds = new Set<string>();
      const recentDonationsList: RecentDonation[] = [];
      
      // Collect unique orphan IDs first
      const orphanIdsToFetch = new Set<string>();
      donationsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.orphanId) {
          orphanIdsToFetch.add(data.orphanId);
        }
      });

      // Fetch all orphan names in parallel
      const orphanNamesMap = new Map<string, string>();
      if (orphanIdsToFetch.size > 0) {
        const orphanPromises = Array.from(orphanIdsToFetch).map(async (orphanId) => {
          try {
            const orphanDoc = await getDoc(doc(db, 'orphans', orphanId));
            if (orphanDoc.exists()) {
              return { id: orphanId, name: orphanDoc.data().name };
            }
          } catch (error) {
            console.error('Error fetching orphan:', error);
          }
          return { id: orphanId, name: 'Unknown Orphan' };
        });
        
        const orphanResults = await Promise.all(orphanPromises);
        orphanResults.forEach(result => {
          if (result) {
            orphanNamesMap.set(result.id, result.name);
          }
        });
      }

      // Process donations
      donationsSnapshot.forEach((donationDoc) => {
        const data = donationDoc.data();
        
        // Calculate total amount
        if (data.status === 'active' || data.status === 'completed') {
          totalAmount += data.amount || 0;
        }
        
        // Count active subscriptions
        if (data.type === 'recurring' && data.status === 'active') {
          activeSubscriptions++;
        }
        
        // Track unique orphans
        if (data.orphanId) {
          orphanIds.add(data.orphanId);
        }

        recentDonationsList.push({
          id: donationDoc.id,
          amount: data.amount,
          type: data.type,
          status: data.status,
          orphanName: orphanNamesMap.get(data.orphanId) || 'Unknown Orphan',
          createdAt: data.createdAt
        });
      });

      setStats({
        totalDonations: donationsSnapshot.size,
        totalAmount,
        orphansSupported: orphanIds.size,
        activeSubscriptions
      });

      setRecentDonations(recentDonationsList.slice(0, 5));
    } catch (error: any) {
      console.error('Error fetching donor data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Recently';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {userData?.displayName}!
            </h1>
            <p className="text-muted-foreground">
              የኢትዮጵያ ወላጅ አልባ ህጻናት እንክብካቤ - Supporting orphans across all Ethiopian regions
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ብር {stats.totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalDonations} {stats.totalDonations === 1 ? 'donation' : 'donations'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orphans Supported</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orphansSupported}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.orphansSupported === 0 ? 'Sponsor an orphan today' : 'Lives impacted'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">Monthly recurring</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.orphansSupported * 10 + stats.totalDonations * 5}
                </div>
                <p className="text-xs text-muted-foreground">Points earned</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/sponsor">
                  <Heart className="w-4 h-4 mr-2" />
                  Sponsor an Orphan
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/donation-methods">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Donation Methods
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/causes">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View All Causes
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/admin">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm">{userData?.displayName || 'Anonymous Donor'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{userData?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  userData?.role === 'admin' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {userData?.role || 'donor'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Impact</p>
                <p className="text-sm font-semibold text-primary">
                  {stats.orphansSupported} {stats.orphansSupported === 1 ? 'orphan' : 'orphans'} supported
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your latest contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">
                          ብር {donation.amount.toLocaleString()}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(donation.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{donation.orphanName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {donation.type}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No donations yet. Start by sponsoring an orphan!</p>
                <Button asChild className="mt-4">
                  <Link to="/sponsor">Get Started</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
