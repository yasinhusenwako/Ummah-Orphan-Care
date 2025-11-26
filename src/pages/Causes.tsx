import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CauseCard from "@/components/CauseCard";
import { useLanguage } from "@/contexts/LanguageContext";
import educationImage from "@/assets/education-child.jpg";
import foodImage from "@/assets/food-children.jpg";
import shelterImage from "@/assets/shelter-children.jpg";
import healthImage from "@/assets/health-child.jpg";

const Causes = () => {
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
    {
      title: t('cause.mental.title'),
      description: t('cause.mental.desc'),
      image: healthImage,
      category: t('causes.healthcare'),
    },
    {
      title: t('cause.skills.title'),
      description: t('cause.skills.desc'),
      image: educationImage,
      category: t('causes.education'),
    },
    {
      title: t('cause.emergency.title'),
      description: t('cause.emergency.desc'),
      image: shelterImage,
      category: "Emergency",
    },
    {
      title: t('cause.sports.title'),
      description: t('cause.sports.desc'),
      image: foodImage,
      category: "Development",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">{t('causes.pageTitle')}</h1>
            <p className="text-xl text-primary-foreground/90">
              {t('causes.pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Causes Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {causes.map((cause, index) => (
              <CauseCard key={index} {...cause} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              {t('causes.howItWorks')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('causes.howItWorksText')}
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-muted-foreground">{t('causes.toPrograms')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-muted-foreground">{t('causes.transparency')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">{t('causes.verified')}</div>
                <div className="text-muted-foreground">{t('causes.impactReports')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Causes;
