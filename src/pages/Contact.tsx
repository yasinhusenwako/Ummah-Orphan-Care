import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">{t('contact.title')}</h1>
            <p className="text-xl text-primary-foreground/90">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">{t('contact.sendMessage')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.name')} *</Label>
                        <Input id="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.yourEmail')} *</Label>
                        <Input id="email" type="email" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('sponsor.phoneNumber')}</Label>
                      <Input id="phone" type="tel" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact.subject')} *</Label>
                      <Input id="subject" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.message')} *</Label>
                      <Textarea 
                        id="message" 
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full font-semibold">
                      {t('contact.send')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('contact.address')}</h3>
                        <p className="text-sm text-muted-foreground">
                          Bole Road<br />
                          Addis Ababa<br />
                          Ethiopia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
                        <p className="text-sm text-muted-foreground">
                          +251 11 XXX XXXX<br />
                          +251 91 XXX XXXX
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
                        <p className="text-sm text-muted-foreground">
                          info@ummahorphancare.org<br />
                          support@ummahorphancare.org
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office Hours</h3>
                        <p className="text-sm text-muted-foreground">
                          Monday - Friday: 9AM - 6PM<br />
                          Saturday: 10AM - 4PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent text-accent-foreground">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-bold">Emergency? - አስቸኳይ?</h3>
                  <p className="text-sm text-accent-foreground/90">
                    For urgent matters regarding children in crisis, please call our 24/7 emergency hotline:
                  </p>
                  <p className="text-xl font-bold">+251 91 XXX XXXX</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
