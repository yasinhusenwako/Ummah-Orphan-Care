import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Tag, Search } from 'lucide-react';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: any;
}

const ManageCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const db = getFirestore();
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const categoriesList: Category[] = [];
      querySnapshot.forEach((doc) => {
        categoriesList.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });

      setCategories(categoriesList);
      setFilteredCategories(categoriesList);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      const db = getFirestore();
      const categoriesRef = collection(db, 'categories');
      
      await addDoc(categoriesRef, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || '📁',
        createdAt: serverTimestamp()
      });

      toast.success('Category added successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      const db = getFirestore();
      const categoryRef = doc(db, 'categories', selectedCategory.id);
      
      await updateDoc(categoryRef, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || '📁'
      });

      toast.success('Category updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setSubmitting(true);
    try {
      const db = getFirestore();
      const categoryRef = doc(db, 'categories', selectedCategory.id);
      
      await deleteDoc(categoryRef);

      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading categories...</p>
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
              <h1 className="text-4xl font-bold text-foreground">Manage Categories</h1>
              <p className="text-muted-foreground">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} available
              </p>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredCategories.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first category to organize orphans.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Category
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {filteredCategories.length === 0 && searchTerm && (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                No categories match your search "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Categories Grid */}
        {filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{category.icon}</div>
                      <div>
                        <CardTitle>{category.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          <Tag className="w-3 h-3 mr-1" />
                          Category
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {category.description || 'No description provided'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize orphans in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Category Name *</Label>
                <Input
                  id="add-name"
                  placeholder="e.g., Education Support"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-icon">Icon (Emoji)</Label>
                <Input
                  id="add-icon"
                  placeholder="e.g., 📚"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  placeholder="Describe this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Education Support"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                <Input
                  id="edit-icon"
                  placeholder="e.g., 📚"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCategory(null);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCategory} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the category "{selectedCategory?.name}". 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCategory}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {submitting ? (
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

export default ManageCategories;
