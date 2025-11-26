import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, DollarSign, TrendingUp, Plus, Settings, LogOut, Loader2, FileText, Calendar } from 'lucide-react';
import { authApi } from '@/api/authApi';
import { toast } from 'sonner';
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { format } from 'date-fns';

interface DashboardStats {
  totalDonors: number;
  totalOrphans: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
}

interface RecentActivity {
  id: string;
  type: 'orphan' | 'donor' | 'donation' | 'update';
  title: string;
  description: string;
  timestamp: any;
}

const Admin = () => {
  const { isAdmin, loading: authLoading, userData } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDonors: 0,
    totalOrphans: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const db = getFirestore();
      
      // Fetch all data in parallel for better performance
      const [usersSnapshot, orphansSnapshot, donationsSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'orphans')),
        getDocs(collection(db, 'donations'))
      ]);

      const totalDonors = usersSnapshot.size;
      const totalOrphans = orphansSnapshot.size;

      // Calculate donations data
      let monthlyRevenue = 0;
      let activeSubscriptions = 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      donationsSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Count active subscriptions
        if (data.type === 'recurring' && data.status === 'active') {
          activeSubscriptions++;
          monthlyRevenue += data.amount || 0;
        }
        
        // Calculate this month's revenue
        if (data.createdAt && (data.status === 'active' || data.status === 'completed')) {
          const donationDate = data.createdAt.toDate();
          if (donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear) {
            if (data.type === 'one-time') {
              monthlyRevenue += data.amount || 0;
            }
          }
        }
      });

      setStats({
        totalDonors,
        totalOrphans,
        monthlyRevenue,
        activeSubscriptions
      });

      // Fetch recent activity
      await fetchRecentActivity(db);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentActivity = async (db: any) => {
    try {
      const activities: RecentActivity[] = [];

      // Fetch recent orphans
      const orphansQuery = query(
        collection(db, 'orphans'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const orphansSnapshot = await getDocs(orphansQuery);
      orphansSnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'orphan',
          title: 'New Orphan Added',
          description: `${data.name} from ${data.region}`,
          timestamp: data.createdAt
        });
      });

      // Fetch recent updates
      const updatesQuery = query(
        collection(db, 'orphanUpdates'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const updatesSnapshot = await getDocs(updatesQuery);
      updatesSnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'update',
          title: 'Update Posted',
          description: data.title,
          timestamp: data.createdAt
        });
      });

      // Fetch recent donations
      const donationsQuery = query(
        collection(db, 'donations'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      donationsSnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'donation',
          title: 'New Donation',
          description: `ብር ${data.amount} - ${data.type}`,
          timestamp: data.createdAt
        });
      });

      // Sort by timestamp and take top 5
      activities.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Recently';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'orphan':
        return <Heart className="w-4 h-4" />;
      case 'donor':
        return <Users className="w-4 h-4" />;
      case 'donation':
        return <DollarSign className="w-4 h-4" />;
      case 'update':
        return <FileText className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'orphan':
        return 'bg-blue-100 text-blue-700';
      case 'donor':
        return 'bg-green-100 text-green-700';
      case 'donation':
        return 'bg-purple-100 text-purple-700';
      case 'update':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/');
  };

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Temporarily allow access for testing - remove this in production
  // if (!isAdmin) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Panel {!isAdmin && '(Testing Mode)'}
            </h1>
            <p className="text-muted-foreground">
              Manage orphans across Ethiopian regions (Addis Ababa, Bahir Dar, Mekelle, Hawassa, etc.)
            </p>
            {!isAdmin && (
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Note:</strong> Your role is "{userData?.role || 'unknown'}". 
                  To enable full admin features, set your role to "admin" in Firebase Firestore.
                </p>
              </div>
            )}
          </div>
          <Button onClick={handleLogout} variant="outline" size="lg" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonors}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orphans</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrphans}</div>
              <p className="text-xs text-muted-foreground">In the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ብር {stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Recurring donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Orphan Management</CardTitle>
              <CardDescription>Add and manage orphan profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/add-orphan')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Orphan
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/orphans')}
              >
                <Heart className="w-4 h-4 mr-2" />
                View All Orphans
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/categories')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donor Management</CardTitle>
              <CardDescription>View and manage donors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/donors')}
              >
                <Users className="w-4 h-4 mr-2" />
                View All Donors
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/donations')}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                View Donations
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/reports')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage updates and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/post-update')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Update
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/updates')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Updates
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
              >
                <Heart className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
