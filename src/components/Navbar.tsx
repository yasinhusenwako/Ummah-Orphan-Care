import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, LogOut, Shield, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { authApi } from "@/api/authApi";
import LanguageToggle from "@/components/LanguageToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, isAdmin, isDonor, loading } = useAuth();
  const { t } = useLanguage();

  // Debug: Log auth state (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Navbar Auth State:', { user: !!user, loading, userData: !!userData });
  }

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Ummah Orphan Care</h1>
              <p className="text-xs text-muted-foreground">Supporting Ethiopian Children</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/causes" className="text-foreground hover:text-primary transition-colors">
              {t('nav.causes')}
            </Link>
            <Link to="/sponsor" className="text-foreground hover:text-primary transition-colors">
              {t('nav.donate')}
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">
              {t('nav.gallery')}
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageToggle />
            {loading && (
              <>
                <Button variant="ghost" size="lg" disabled>
                  <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </Button>
              </>
            )}

            {!loading && !user && (
              <>
                <Button asChild variant="ghost" size="lg" className="hover:bg-accent">
                  <Link to="/login" className="no-underline">
                    Login
                  </Link>
                </Button>
              </>
            )}

            {!loading && user && (
              <>
                {isAdmin && (
                  <Button asChild variant="outline" size="lg">
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2">
                      <User className="w-4 h-4" />
                      {userData?.displayName || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userData?.displayName}</p>
                        <p className="text-xs text-muted-foreground">{userData?.email}</p>
                        {userData?.role && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">
                            {userData.role}
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/causes"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Causes
            </Link>
            <Link
              to="/sponsor"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
            <Link
              to="/gallery"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            {loading && (
              <div className="text-center py-2 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}

            {!loading && !user && (
              <>
                <Button asChild className="w-full" variant="outline" size="lg">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
              </>
            )}

            {!loading && user && (
              <>
                <div className="py-2 border-t border-border">
                  <p className="text-sm font-medium text-foreground">{userData?.displayName}</p>
                  <p className="text-xs text-muted-foreground">{userData?.email}</p>
                  {userData?.role && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block mt-1">
                      {userData.role}
                    </span>
                  )}
                </div>
                <Button asChild className="w-full" variant="outline" size="lg">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                  variant="destructive"
                  size="lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
