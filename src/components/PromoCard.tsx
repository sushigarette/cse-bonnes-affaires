import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Clock, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromoCardProps {
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  partner: string;
  category: string;
  image?: string;
}

const PromoCard = ({
  title,
  description,
  code,
  discount,
  validUntil,
  partner,
  category,
  image
}: PromoCardProps) => {
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copié !",
      description: `Le code ${code} a été copié dans le presse-papiers.`,
    });
  };

  return (
    <Card className="card-elevated hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="success" className="bg-success text-success-foreground">
          <Percent className="w-3 h-3 mr-1" />
          {discount}
        </Badge>
      </div>

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
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-3">
          {description}
        </p>
        
        <div className="bg-muted rounded-lg p-3 border-dashed border-2 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Code promo :</p>
              <p className="font-mono font-bold text-lg text-primary">{code}</p>
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
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          Valide jusqu'au {validUntil}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary-foreground hover:bg-primary"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Utiliser
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromoCard;