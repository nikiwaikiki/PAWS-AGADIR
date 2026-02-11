import { MapPin, Plus, User, Shield, Menu, X, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsHelper } from "@/hooks/useHelperApplication";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "@/assets/logo.png";

const Header = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { data: isHelper } = useIsHelper(user?.id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  
  const isActive = (path: string) => location.pathname === path;
  const canAccessDashboard = isAdmin || isHelper;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b animate-fade-in">
      <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Save The Paws" className="h-10 sm:h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t('common.home')}
          </Link>
          <Link
            to="/map"
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              isActive("/map") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t('common.map')}
          </Link>
          <Link
            to="/dogs"
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              isActive("/dogs") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="w-4 h-4" />
            {t('common.dogs')}
          </Link>
          {canAccessDashboard && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                isActive("/admin") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-4 h-4" />
              {isAdmin ? t('common.admin') : t('common.dashboard')}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          {user && (
            <Link to="/add">
              <Button variant="hero" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('common.report')}</span>
              </Button>
            </Link>
          )}
          {user ? (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={signOut}
              title={t('common.logout')}
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t('common.home')}
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive("/map") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t('common.map')}
            </Link>
            <Link
              to="/dogs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive("/dogs") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="w-4 h-4" />
              {t('common.dogs')}
            </Link>
            {canAccessDashboard && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive("/admin") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-4 h-4" />
                {isAdmin ? t('common.admin') : t('common.dashboard')}
              </Link>
            )}
            {!user && (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-primary"
              >
                <User className="w-4 h-4" />
                {t('common.login')}
              </Link>
            )}
            {user && !canAccessDashboard && (
              <Link
                to="/become-helper"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-primary"
              >
                <Heart className="w-4 h-4" />
                {t('common.becomeHelper')}
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('common.logout')}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
