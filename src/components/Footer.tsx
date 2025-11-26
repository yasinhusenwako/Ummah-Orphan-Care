import { Link } from "react-router-dom";
import { Heart, Mail, MapPin, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Ummah Orphan Care</h3>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-accent transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-accent transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/causes" className="text-sm hover:text-accent transition-colors">
                  {t('nav.causes')}
                </Link>
              </li>
              <li>
                <Link to="/sponsor" className="text-sm hover:text-accent transition-colors">
                  {t('nav.donate')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Causes */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('causes.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/causes" className="text-sm hover:text-accent transition-colors">
                  {t('causes.education')}
                </Link>
              </li>
              <li>
                <Link to="/causes" className="text-sm hover:text-accent transition-colors">
                  {t('causes.food')}
                </Link>
              </li>
              <li>
                <Link to="/causes" className="text-sm hover:text-accent transition-colors">
                  {t('causes.shelter')}
                </Link>
              </li>
              <li>
                <Link to="/causes" className="text-sm hover:text-accent transition-colors">
                  {t('causes.healthcare')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+251 11 XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@ethiopianorphansupport.org</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} Ummah Orphan Care. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
