import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDiscount } from "@/lib/formatDiscount";
import { formatTextWithLineBreaks } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PromoCardProps {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  partner: string;
  category: string;
  image?: string;
  websiteUrl?: string;
  onRead?: () => void;
}

const PromoCard = ({
  id,
  title,
  description,
  code,
  discount,
  validUntil,
  partner,
  category,
  image,
  websiteUrl,
  onRead
}: PromoCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier si le code promo se termine dans moins de 24 heures
  const isExpiringSoon = () => {
    const now = new Date();
    const validUntilDate = new Date(validUntil);
    const timeDiff = validUntilDate.getTime() - now.getTime();
    const hoursLeft = timeDiff / (1000 * 3600);
    return hoursLeft <= 24 && hoursLeft > 0;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copié !",
      description: `Le code ${code} a été copié dans le presse-papiers.`,
    });
  };

  const handleRead = () => {
    if (onRead) {
      onRead();
    }
    navigate(`/promos/${id}`);
  };

  const handleUsePromo = () => {
    if (websiteUrl) {
      // Ajouter https:// si le lien ne commence pas par un protocole
      let url = websiteUrl.trim();
      if (!url.match(/^https?:\/\//)) {
        url = `https://${url}`;
      }
      
      // Ouvrir le lien dans un nouvel onglet
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Lien non disponible",
        description: "Aucun lien vers le site partenaire n'est disponible pour ce code promo.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`card-elevated hover:shadow-lg transition-all duration-300 group relative overflow-hidden ${
      isExpiringSoon() ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
    }`}>
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="success" className="bg-success text-success-foreground">
          {formatDiscount(discount)}
        </Badge>
      </div>
      
      {isExpiringSoon() && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
            ⚠️ Expire bientôt
          </Badge>
        </div>
      )}

      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <span className="text-xs font-medium text-primary">{partner}</span>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <div 
          className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatTextWithLineBreaks(description)
          }}
        />
        
        <div className={`rounded-lg p-3 border-dashed border-2 ${
          isExpiringSoon() 
            ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' 
            : 'bg-muted border-border'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Code promo :</p>
              <p className={`font-mono font-bold text-lg ${
                isExpiringSoon() 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-primary'
              }`}>
                {code}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyCode}
              className="ml-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className={`flex items-center text-xs ${
          isExpiringSoon() 
            ? 'text-red-600 dark:text-red-400 font-medium' 
            : 'text-muted-foreground'
        }`}>
          <Clock className="w-3 h-3 mr-1" />
          {isExpiringSoon() ? '⚠️ Expire bientôt - ' : ''}Valide jusqu'au {validUntil}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRead}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            <Eye className="w-4 h-4 mr-1" />
            Lire
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleUsePromo}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
            disabled={!websiteUrl}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Consulter
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromoCard;