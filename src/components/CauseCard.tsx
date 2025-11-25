import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface CauseCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
}

const CauseCard = ({ title, description, image, category }: CauseCardProps) => {
  const { t } = useLanguage();
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>

        <Button asChild className="w-full group/btn">
          <Link to="/sponsor">
            {t('causes.donateNow')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CauseCard;
