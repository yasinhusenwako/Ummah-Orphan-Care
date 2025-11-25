import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Eye, Target, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  const values = [
    {
      icon: Heart,
      title: "ፍቅር (Love)",
      description: "We approach every Ethiopian child with compassion, understanding their unique needs and cultural background.",
    },
    {
      icon: Users,
      title: "አንድነት (Unity)",
      description: "We unite communities across all 12 Ethiopian regions for the common cause of supporting orphaned children.",
    },
    {
      icon: Target,
      title: "ተስፋ (Hope)",
      description: "Our work is driven by building hope and creating lasting positive change in Ethiopian children's lives.",
    },
    {
      icon: Eye,
      title: "ግልጽነት (Transparency)",
      description: "We maintain complete transparency in how Ethiopian Birr donations are utilized and impact is measured.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">{t('about.title')}</h1>
            <p className="text-xl text-primary-foreground/90">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{t('about.mission')}</h2>
                <p className="text-muted-foreground text-lg">
                  {t('about.missionText')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{t('about.vision')}</h2>
                <p className="text-muted-foreground text-lg">
                  {t('about.visionText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-8 text-center">{t('about.story')}</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                {t('about.storyP1')}
              </p>
              <p>
                {t('about.storyP2')}
              </p>
              <p>
                {t('about.storyP3')}
              </p>
              <p className="font-semibold text-foreground">
                {t('about.storyP4')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('about.values')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('about.valuesSubtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('about.impact')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">5,000+</div>
              <div className="text-primary-foreground/80">{t('about.childrenSupported')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">12</div>
              <div className="text-primary-foreground/80">{t('about.regions')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">850+</div>
              <div className="text-primary-foreground/80">{t('about.graduates')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">15K+</div>
              <div className="text-primary-foreground/80">{t('about.donors')}</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
