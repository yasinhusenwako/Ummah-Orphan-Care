import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Loader2, 
  TrendingUp, 
  Users, 
  Heart, 
  FileText,
  Eye,
  BarChart3,
  Activity
} from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';

interface AnalyticsData {
  totalOrphans: number;
  totalDonors: number;
  totalUpdates: number;
  totalCategories: number;
  orphansByStatus: { [key: string]: number };
  orphansByGender: { [key: string]: number };
  orphansByRegion: { [key: string]: number };
  recentActivity: {
    newOrphansThisMonth: number;
    newDonorsThisMonth: number;
    updatesThisMonth: number;
  };
}

const ViewAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrphans: 0,
    totalDonors: 0,
    totalUpdates: 0,
    totalCategories: 0,
    orphansByStatus: {},
    orphansByGender: {},
    orphansByRegion: {},
    recentActivity: {
      newOrphansThisMonth: 0,
      newDonorsThisMonth: 0,
      updatesThisMonth: 0
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const db = getFirestore();
      
      // Fetch orphans
      const orphansSnapshot = await getDocs(collection(db, 'orphans'));
      const totalOrphans = orphansSnapshot.size;
      
      const orphansByStatus: { [key: string]: number } = {};
      const orphansByGender: { [key: string]: number } = {};
      const orphansByRegion: { [key: string]: number } = {};
      
      let newOrphansThisMonth = 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      orphansSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Count by status
        const status = data.status || 'unknown';
        orphansByStatus[status] = (orphansByStatus[status] || 0) + 1;
        
        // Count by gender
        const gender = data.gender || 'unknown';
        orphansByGender[gender] = (orphansByGender[gender] || 0) + 1;
        
        // Count by region
        const region = data.region || 'Unknown';
        orphansByRegion[region] = (orphansByRegion[region] || 0) + 1;
        
        // Count new orphans this month
        if (data.createdAt) {
          const createdDate = data.createdAt.toDate();
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            newOrphansThisMonth++;
          }
        }
      });

      // Fetch donors
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalDonors = usersSnapshot.size;
      
      let newDonorsThisMonth = 0;
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          const createdDate = data.createdAt.toDate();
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            newDonorsThisMonth++;
          }
        }
      });

      // Fetch updates
      const updatesSnapshot = await getDocs(collection(db, 'orphanUpdates'));
      const totalUpdates = updatesSnapshot.size;
      
      let updatesThisMonth = 0;
      updatesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          const createdDate = data.createdAt.toDate();
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            updatesThisMonth++;
          }
        }
      });

      // Fetch categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const totalCategories = categoriesSnapshot.size;

      setAnalytics({
        totalOrphans,
        totalDonors,
        totalUpdates,
        totalCategories,
        orphansByStatus,
        orphansByGender,
        orphansByRegion,
        recentActivity: {
          newOrphansThisMonth,
          newDonorsThisMonth,
          updatesThisMonth
        }
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      active: 'Seeking Support',
      sponsored: 'Sponsored',
      inactive: 'Inactive'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-foreground">Content Analytics</h1>
            <p className="text-muted-foreground">
              Insights and statistics about your content
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orphans</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrphans}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.recentActivity.newOrphansThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalDonors}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.recentActivity.newDonorsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUpdates}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.recentActivity.updatesThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCategories}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="status" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">
              <Activity className="w-4 h-4 mr-2" />
              By Status
            </TabsTrigger>
            <TabsTrigger value="gender">
              <Users className="w-4 h-4 mr-2" />
              By Gender
            </TabsTrigger>
            <TabsTrigger value="region">
              <TrendingUp className="w-4 h-4 mr-2" />
              By Region
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orphans by Status</CardTitle>
                <CardDescription>Distribution of orphans by their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.orphansByStatus).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analytics.orphansByStatus).map(([status, count]) => {
                      const percentage = analytics.totalOrphans > 0 
                        ? (count / analytics.totalOrphans) * 100 
                        : 0;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">
                              {getStatusLabel(status)}
                            </span>
                            <span className="text-lg font-bold">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-primary h-3 rounded-full transition-all" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gender" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orphans by Gender</CardTitle>
                <CardDescription>Gender distribution of orphans</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.orphansByGender).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analytics.orphansByGender).map(([gender, count]) => {
                      const percentage = analytics.totalOrphans > 0 
                        ? (count / analytics.totalOrphans) * 100 
                        : 0;
                      return (
                        <div key={gender} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{gender}</span>
                            <span className="text-lg font-bold">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${
                                gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="region" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orphans by Region</CardTitle>
                <CardDescription>Regional distribution across Ethiopia</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.orphansByRegion).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analytics.orphansByRegion)
                      .sort(([, a], [, b]) => b - a)
                      .map(([region, count]) => {
                        const percentage = analytics.totalOrphans > 0 
                          ? (count / analytics.totalOrphans) * 100 
                          : 0;
                        return (
                          <div key={region} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{region}</span>
                              <span className="text-lg font-bold">
                                {count} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-green-500 h-3 rounded-full transition-all" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>This Month's Activity</CardTitle>
            <CardDescription>Summary of recent platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Heart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-3xl font-bold text-blue-700">
                  {analytics.recentActivity.newOrphansThisMonth}
                </div>
                <p className="text-sm text-blue-600 mt-1">New Orphans Added</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-3xl font-bold text-green-700">
                  {analytics.recentActivity.newDonorsThisMonth}
                </div>
                <p className="text-sm text-green-600 mt-1">New Donors Joined</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-3xl font-bold text-purple-700">
                  {analytics.recentActivity.updatesThisMonth}
                </div>
                <p className="text-sm text-purple-600 mt-1">Updates Posted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewAnalytics;
