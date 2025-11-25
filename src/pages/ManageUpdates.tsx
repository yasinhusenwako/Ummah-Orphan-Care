import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Search, Plus, Trash2, Loader2, FileText, Calendar, User } from 'lucide-react';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Update {
  id: string;
  orphanId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: any;
  orphanName?: string;
}

const ManageUpdates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = updates.filter(update =>
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.orphanName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUpdates(filtered);
    } else {
      setFilteredUpdates(updates);
    }
  }, [searchTerm, updates]);

  const fetchUpdates = async () => {
    try {
      const db = getFirestore();
      const updatesRef = collection(db, 'orphanUpdates');
      const q = query(updatesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const updatesList: Update[] = [];
      
      for (const updateDoc of querySnapshot.docs) {
        const data = updateDoc.data();
        
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

        updatesList.push({
          id: updateDoc.id,
          ...data,
          orphanName
        } as Update);
      }

      setUpdates(updatesList);
      setFilteredUpdates(updatesList);
    } catch (error: any) {
      console.error('Error fetching updates:', error);
      toast.error('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUpdate) return;

    setDeleting(true);
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'orphanUpdates', selectedUpdate.id));

      toast.success('Update deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedUpdate(null);
      fetchUpdates();
    } catch (error: any) {
      console.error('Error deleting update:', error);
      toast.error('Failed to delete update');
    } finally {
      setDeleting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading updates...</p>
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
              <h1 className="text-4xl font-bold text-foreground">Manage Updates</h1>
              <p className="text-muted-foreground">
                {filteredUpdates.length} {filteredUpdates.length === 1 ? 'update' : 'updates'} posted
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/post-update')}>
            <Plus className="w-4 h-4 mr-2" />
            Post New Update
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredUpdates.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Updates Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start sharing updates about orphans to keep donors informed.
              </p>
              <Button onClick={() => navigate('/admin/post-update')}>
                <Plus className="w-4 h-4 mr-2" />
                Post First Update
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredUpdates.length === 0 && searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No updates match your search "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Updates List */}
        {filteredUpdates.length > 0 && (
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <Card key={update.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {update.imageUrl && (
                      <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={update.imageUrl}
                          alt={update.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{update.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{update.orphanName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(update.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedUpdate(update);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground line-clamp-3">
                        {update.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Update?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedUpdate?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ManageUpdates;
