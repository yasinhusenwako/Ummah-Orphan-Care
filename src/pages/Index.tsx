import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CauseCard from "@/components/CauseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, GraduationCap, Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-children.jpg";
import educationImage from "@/assets/education-child.jpg";
import foodImage from "@/assets/food-children.jpg";
import shelterImage from "@/assets/shelter-children.jpg";
import healthImage from "@/assets/health-child.jpg";

const Index = () => {
  const { t } = useLanguage();
  const causes = [
    {
      title: t('cause.education.title'),
      description: t('cause.education.desc'),
      image: educationImage,
      category: t('causes.education'),
    },
    {
      title: t('cause.food.title'),
      description: t('cause.food.desc'),
      image: foodImage,
      category: t('causes.food'),
    },
    {
      title: t('cause.shelter.title'),
      description: t('cause.shelter.desc'),
      image: shelterImage,
      category: t('causes.shelter'),
    },
    {
      title: t('cause.healthcare.title'),
      description: t('cause.healthcare.desc'),
      image: healthImage,
      category: t('causes.healthcare'),
    },
  ];

  const stats = [
    { icon: Users, value: "5,000+", label: t('stats.childrenHelped') },
    { icon: GraduationCap, value: "850+", label: t('stats.educated') },
    { icon: HomeIcon, value: "12", label: t('stats.regionalCenters') },
    { icon: Heart, value: "98%", label: "Success Rate", highlight: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Children smiling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6 text-primary-foreground">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                Non-Profit Charity
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-accent">{t('hero.title')}</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" variant="secondary" className="text-lg font-semibold">
                <Link to="/sponsor">{t('hero.donateNow')}</Link>
              </Button>
              <Button asChild size="lg" className="text-lg font-semibold bg-white text-primary hover:bg-white/90">
                <Link to="/about">{t('hero.learnMore')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  stat.highlight ? 'bg-green-500' : 'bg-primary'
                }`}>
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className={`text-3xl md:text-4xl font-bold ${
                  stat.highlight ? 'text-green-600' : 'text-foreground'
                }`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('causes.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('causes.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {causes.map((cause, index) => (
              <CauseCard key={index} {...cause} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/causes">{t('causes.viewAll')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                {t('mission.title')}
              </h2>
              <p className="text-lg text-primary-foreground/90">
                {t('mission.description')}
              </p>
              <p className="text-primary-foreground/80">
                {t('mission.detail')}
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/about">{t('mission.discover')}</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-accent">100%</div>
                  <div className="text-sm text-primary-foreground/80">Funds to Programs</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-accent">12</div>
                  <div className="text-sm text-primary-foreground/80">Ethiopian Regions</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-accent">15K+</div>
                  <div className="text-sm text-primary-foreground/80">Monthly Donors</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-accent">100%</div>
                  <div className="text-sm text-primary-foreground/80">Transparency</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-accent-foreground/90">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="text-lg font-semibold">
                <Link to="/sponsor">{t('nav.donateMonthly')}</Link>
              </Button>
              <Button asChild size="lg" className="text-lg font-semibold bg-white text-accent hover:bg-white/90">
                <Link to="/contact">{t('cta.contactUs')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
