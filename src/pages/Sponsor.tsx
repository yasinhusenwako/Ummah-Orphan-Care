import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Shield, CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Sponsor = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState("1500");
  const [customAmount, setCustomAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your commitment!", {
      description: "Redirecting to payment methods..."
    });
    // Redirect to donation methods page
    setTimeout(() => {
      navigate('/donation-methods');
    }, 1000);
  };

  const amounts = ["750", "1500", "3000", "7500"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">{t('sponsor.title')}</h1>
            <p className="text-xl text-primary-foreground/90">
              {t('sponsor.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('sponsor.monthlyDetails')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Donation Amount */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">{t('sponsor.selectAmount')}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {amounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                            }}
                            className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                              selectedAmount === amount && !customAmount
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {language === 'am' ? 'ብር' : 'ETB'} {amount}/mo
                          </button>
                        ))}
                      </div>
                      <div>
                        <Label htmlFor="custom">{t('sponsor.customAmount')}</Label>
                        <div className="relative mt-2">
                          <span className="absolute left-3 top-3 text-muted-foreground">
                            {language === 'am' ? 'ብር' : 'ETB'}
                          </span>
                          <Input
                            id="custom"
                            type="number"
                            placeholder={t('sponsor.enterAmount')}
                            className="pl-12"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setSelectedAmount("");
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cause Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="cause">{t('sponsor.supportArea')}</Label>
                      <Select defaultValue="general">
                        <SelectTrigger id="cause">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">{t('sponsor.whereMostNeeded')}</SelectItem>
                          <SelectItem value="education">{t('causes.education')}</SelectItem>
                          <SelectItem value="food">{t('causes.food')}</SelectItem>
                          <SelectItem value="shelter">{t('causes.shelter')}</SelectItem>
                          <SelectItem value="healthcare">{t('causes.healthcare')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Region Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="region">
                        {language === 'am' ? 'Ethiopian Region - ክልል' : 'Ethiopian Region'}
                      </Label>
                      <Select defaultValue="any">
                        <SelectTrigger id="region">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">{t('sponsor.anyRegion')}</SelectItem>
                          <SelectItem value="addis-ababa">{language === 'am' ? 'አዲስ አበባ' : 'Addis Ababa'}</SelectItem>
                          <SelectItem value="tigray">{language === 'am' ? 'ትግራይ' : 'Tigray'}</SelectItem>
                          <SelectItem value="amhara">{language === 'am' ? 'አማራ' : 'Amhara'}</SelectItem>
                          <SelectItem value="oromia">{language === 'am' ? 'ኦሮሚያ' : 'Oromia'}</SelectItem>
                          <SelectItem value="somali">{language === 'am' ? 'ሶማሌ' : 'Somali'}</SelectItem>
                          <SelectItem value="afar">{language === 'am' ? 'አፋር' : 'Afar'}</SelectItem>
                          <SelectItem value="sidama">{language === 'am' ? 'ሲዳማ' : 'Sidama'}</SelectItem>
                          <SelectItem value="snnpr">{language === 'am' ? 'ደቡብ ብሔሮች' : 'SNNPR'}</SelectItem>
                          <SelectItem value="benishangul">{language === 'am' ? 'ቤንሻንጉል ጉሙዝ' : 'Benishangul-Gumuz'}</SelectItem>
                          <SelectItem value="gambela">{language === 'am' ? 'ጋምቤላ' : 'Gambela'}</SelectItem>
                          <SelectItem value="harari">{language === 'am' ? 'ሐረሪ' : 'Harari'}</SelectItem>
                          <SelectItem value="dire-dawa">{language === 'am' ? 'ድሬዳዋ' : 'Dire Dawa'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Personal Information */}
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-semibold mb-4">{t('sponsor.yourInfo')}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t('sponsor.firstName')} *</Label>
                          <Input id="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t('sponsor.lastName')} *</Label>
                          <Input id="lastName" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">{t('sponsor.emailAddress')} *</Label>
                          <Input id="email" type="email" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="phone">{t('sponsor.phoneNumber')}</Label>
                          <Input id="phone" type="tel" />
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-2 pt-4">
                      <Checkbox id="terms" required />
                      <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                        {t('sponsor.terms')}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full text-lg font-semibold">
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t('sponsor.proceedPayment')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Impact Card */}
              <Card className="border-2 border-accent/20 bg-accent/5">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">
                    {language === 'am' ? 'Your Impact - ተጽእኖዎ' : 'Your Impact'}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">
                        {language === 'am' ? 'ብር' : 'ETB'} 750/month
                      </span>
                      <span className="font-semibold">{t('sponsor.foodForChild')}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">
                        {language === 'am' ? 'ብር' : 'ETB'} 1,500/month
                      </span>
                      <span className="font-semibold">{t('sponsor.educationSupport')}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">
                        {language === 'am' ? 'ብር' : 'ETB'} 3,000/month
                      </span>
                      <span className="font-semibold">{t('sponsor.fullSupport')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'am' ? 'ብር' : 'ETB'} 7,500/month
                      </span>
                      <span className="font-semibold">{t('sponsor.multipleSupport')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">{t('sponsor.secureTransparent')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>{t('sponsor.bankEncryption')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>{t('sponsor.impactUpdates')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>{t('sponsor.cancelAnytime')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>{t('sponsor.taxDeductible')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-bold">{t('sponsor.joinDonors')}</h3>
                  <p className="text-sm text-primary-foreground/80">
                    {t('sponsor.communityText')}
                  </p>
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

export default Sponsor;
