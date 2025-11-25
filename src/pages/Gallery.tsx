import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const Gallery = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Ethiopian-focused gallery images
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      alt: "Ethiopian children in classroom learning",
      category: "education"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80",
      alt: "Happy Ethiopian children smiling",
      category: "community"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80",
      alt: "African children playing outdoors",
      category: "activities"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      alt: "Children receiving educational support",
      category: "education"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=800&q=80",
      alt: "Healthcare services for Ethiopian children",
      category: "healthcare"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      alt: "Ethiopian children studying together",
      category: "education"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      alt: "Community gathering and support",
      category: "community"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      alt: "Children enjoying recreational activities",
      category: "activities"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
      alt: "Medical care and health checkups",
      category: "healthcare"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80",
      alt: "Ethiopian children with school supplies",
      category: "education"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
      alt: "Community meal and nutrition program",
      category: "community"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
      alt: "Healthcare workers with children",
      category: "healthcare"
    },
    {
      id: 13,
      src: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800&q=80",
      alt: "Children playing sports together",
      category: "activities"
    },
    {
      id: 14,
      src: "https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=800&q=80",
      alt: "Ethiopian children in learning environment",
      category: "education"
    },
    {
      id: 15,
      src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80",
      alt: "Children enjoying community activities",
      category: "activities"
    }
  ];

  const categories = [
    { value: "all", label: t('gallery.allPhotos') },
    { value: "education", label: t('causes.education') },
    { value: "healthcare", label: t('causes.healthcare') },
    { value: "community", label: "Community" },
    { value: "activities", label: "Activities" }
  ];

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('gallery.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  {t('gallery.noImages')}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto"
              />
              <div className="p-6 bg-background">
                <p className="text-lg font-medium text-foreground">
                  {selectedImage.alt}
                </p>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {selectedImage.category}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
