import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SetAdminRole = () => {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSetAdminRole = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      await updateDoc(userRef, {
        role: 'admin',
        updatedAt: new Date().toISOString()
      });

      setSuccess(true);
      setError(null);
      
      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">Set Admin Role</CardTitle>
          </div>
          <CardDescription>
            Update your user role to admin to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-secondary rounded-lg space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Current Status</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Email:</strong> {userData?.email || user?.email}
              </p>
              <p className="text-sm">
                <strong>Current Role:</strong>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  userData?.role === 'admin' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userData?.role || 'donor'}
                </span>
              </p>
              <p className="text-sm">
                <strong>UID:</strong> <code className="text-xs bg-muted px-1 py-0.5 rounded">{user?.uid}</code>
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-sm text-green-800">
                  Your role has been updated to admin. The page will refresh automatically...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!success && (
            <div className="space-y-3">
              <h3 className="font-semibold">What this does:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Updates your role in Firestore to "admin"</li>
                <li>Enables access to the Admin Panel</li>
                <li>Shows admin-specific features in the navbar</li>
                <li>Automatically refreshes the page after update</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSetAdminRole}
              disabled={loading || success || userData?.role === 'admin'}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : userData?.role === 'admin' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Already Admin
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Set as Admin
                </>
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Alternative Method */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-sm mb-2">Alternative Method:</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If the button doesn't work, you can manually update your role in Firebase Console:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console</a></li>
              <li>Select project: <strong>ummah-orphan-care</strong></li>
              <li>Go to <strong>Firestore Database</strong></li>
              <li>Find <strong>users</strong> collection</li>
              <li>Find your document (UID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{user?.uid?.substring(0, 8)}...</code>)</li>
              <li>Edit <strong>role</strong> field to: <code className="text-xs bg-muted px-1 py-0.5 rounded">admin</code></li>
              <li>Save and refresh this page</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetAdminRole;
