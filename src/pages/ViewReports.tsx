import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, TrendingUp, Users, Heart, DollarSign, Calendar, Download, BarChart3, PieChart } from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ReportData {
  totalDonors: number;
  totalOrphans: number;
  totalDonations: number;
  totalAmount: number;
  activeSubscriptions: number;
  oneTimeDonations: number;
  orphansByRegion: { [key: string]: number };
  donationsByMonth: { [key: string]: number };
}

const ViewReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    totalDonors: 0,
    totalOrphans: 0,
    totalDonations: 0,
    totalAmount: 0,
    activeSubscriptions: 0,
    oneTimeDonations: 0,
    orphansByRegion: {},
    donationsByMonth: {}
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const exportReport = () => {
    const reportText = `
Ummah Orphan Care - Analytics Report
Generated: ${format(new Date(), 'MMMM dd, yyyy')}

=== OVERVIEW ===
Total Donors: ${reportData.totalDonors}
Total Orphans: ${reportData.totalOrphans}
Total Donations: ${reportData.totalDonations}
Total Revenue: ብር ${reportData.totalAmount.toLocaleString()}

=== DONATION BREAKDOWN ===
Active Subscriptions: ${reportData.activeSubscriptions}
One-Time Donations: ${reportData.oneTimeDonations}

=== ORPHANS BY REGION ===
${Object.entries(reportData.orphansByRegion).map(([region, count]) => `${region}: ${count}`).join('\n')}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const fetchReportData = async () => {
    try {
      const db = getFirestore();
      
      // Fetch donors
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalDonors = usersSnapshot.size;

      // Fetch orphans
      const orphansSnapshot = await getDocs(collection(db, 'orphans'));
      const totalOrphans = orphansSnapshot.size;

      // Count orphans by region
      const orphansByRegion: { [key: string]: number } = {};
      orphansSnapshot.forEach((doc) => {
        const region = doc.data().region || 'Unknown';
        orphansByRegion[region] = (orphansByRegion[region] || 0) + 1;
      });

      // Fetch donations
      const donationsSnapshot = await getDocs(collection(db, 'donations'));
      const totalDonations = donationsSnapshot.size;
      
      let totalAmount = 0;
      let activeSubscriptions = 0;
      let oneTimeDonations = 0;

      donationsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'active' || data.status === 'completed') {
          totalAmount += data.amount || 0;
        }
        if (data.type === 'recurring' && data.status === 'active') {
          activeSubscriptions++;
        }
        if (data.type === 'one-time') {
          oneTimeDonations++;
        }
      });

      setReportData({
        totalDonors,
        totalOrphans,
        totalDonations,
        totalAmount,
        activeSubscriptions,
        oneTimeDonations,
        orphansByRegion,
        donationsByMonth: {}
      });
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load reports', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Generating reports...</p>
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
              <h1 className="text-4xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Overview of platform statistics and performance
              </p>
            </div>
          </div>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalDonors}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orphans</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalOrphans}</div>
              <p className="text-xs text-muted-foreground">In the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ብር {reportData.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ethiopian Birr</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalDonations}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="donations">
              <DollarSign className="w-4 h-4 mr-2" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="regions">
              <PieChart className="w-4 h-4 mr-2" />
              Regions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Types</CardTitle>
                  <CardDescription>Breakdown by donation type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Recurring Subscriptions</span>
                    </div>
                    <span className="text-2xl font-bold">{reportData.activeSubscriptions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${reportData.totalDonations > 0 ? (reportData.activeSubscriptions / reportData.totalDonations) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">One-Time Donations</span>
                    </div>
                    <span className="text-2xl font-bold">{reportData.oneTimeDonations}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${reportData.totalDonations > 0 ? (reportData.oneTimeDonations / reportData.totalDonations) * 100 : 0}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Important performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Average Donation</span>
                    <span className="text-lg font-bold text-green-700">
                      ብር {reportData.totalDonations > 0 ? Math.round(reportData.totalAmount / reportData.totalDonations).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Donor Participation</span>
                    <span className="text-lg font-bold text-blue-700">
                      {reportData.totalDonors > 0 ? Math.round((reportData.totalDonations / reportData.totalDonors) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Orphans per Donor</span>
                    <span className="text-lg font-bold text-purple-700">
                      {reportData.totalDonors > 0 ? (reportData.totalOrphans / reportData.totalDonors).toFixed(1) : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Statistics</CardTitle>
                <CardDescription>Detailed breakdown of all donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-3xl font-bold text-green-700">
                      ብር {reportData.totalAmount.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-600 mt-1">Total Revenue</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-3xl font-bold text-purple-700">
                      {reportData.activeSubscriptions}
                    </div>
                    <p className="text-sm text-purple-600 mt-1">Monthly Recurring</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-3xl font-bold text-orange-700">
                      {reportData.oneTimeDonations}
                    </div>
                    <p className="text-sm text-orange-600 mt-1">One-Time Gifts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orphans by Region</CardTitle>
                <CardDescription>Distribution across Ethiopian regions</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(reportData.orphansByRegion).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(reportData.orphansByRegion)
                      .sort(([, a], [, b]) => b - a)
                      .map(([region, count]) => {
                        const percentage = reportData.totalOrphans > 0 ? (count / reportData.totalOrphans) * 100 : 0;
                        return (
                          <div key={region} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{region}</span>
                              <span className="text-lg font-bold">{count} ({percentage.toFixed(1)}%)</span>
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
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No orphans registered yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
            <CardDescription>Key insights and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Platform Growth</p>
                  <p className="text-sm text-muted-foreground">
                    {reportData.totalDonors} donors supporting {reportData.totalOrphans} orphans across Ethiopia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Financial Impact</p>
                  <p className="text-sm text-muted-foreground">
                    Total of ብር {reportData.totalAmount.toLocaleString()} raised through {reportData.totalDonations} donations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Recurring Support</p>
                  <p className="text-sm text-muted-foreground">
                    {reportData.activeSubscriptions} active monthly subscriptions providing sustainable support
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewReports;
