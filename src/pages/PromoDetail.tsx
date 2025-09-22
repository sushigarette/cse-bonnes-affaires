import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Copy, Clock, Percent, Calendar, Building2, Tag } from "lucide-react";
import { getPromoById, Promo, recordPromoUsage } from "@/lib/database";
import { formatDiscount } from "@/lib/formatDiscount";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PromoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPromo();
    }
  }, [id]);

  const loadPromo = async () => {
    try {
      if (!id) return;
      
      const promoData = await getPromoById(id);
      if (promoData) {
        setPromo(promoData);
        // Enregistrer l'utilisation du code promo
        await recordPromoUsage(id);
      } else {
        navigate('/promos');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du code promo:', error);
      navigate('/promos');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (promo) {
      navigator.clipboard.writeText(promo.code);
      toast({
        title: "Code copié !",
        description: `Le code ${promo.code} a été copié dans le presse-papiers.`,
      });
    }
  };

  const handleUsePromo = () => {
    if (promo?.website_url) {
      let url = promo.website_url.trim();
      if (!url.match(/^https?:\/\//)) {
        url = `https://${url}`;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Lien non disponible",
        description: "Aucun lien vers le site partenaire n'est disponible pour ce code promo.",
        variant: "destructive"
      });
    }
  };

  // Vérifier si le code promo se termine dans moins de 24 heures
  const isExpiringSoon = () => {
    if (!promo) return false;
    const now = new Date();
    const validUntilDate = new Date(promo.valid_until);
    const timeDiff = validUntilDate.getTime() - now.getTime();
    const hoursLeft = timeDiff / (1000 * 3600);
    return hoursLeft <= 24 && hoursLeft > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Code promo non trouvé</h1>
          <Button onClick={() => navigate('/promos')}>
            Retour aux codes promo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/promos')}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux codes promo
          </Button>
        </div>

        {/* Promo Detail Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  <Tag className="w-3 h-3 mr-1" />
                  {promo.category}
                </Badge>
                <Badge variant="success" className="bg-success text-success-foreground text-sm">
                  <Percent className="w-3 h-3 mr-1" />
                  {formatDiscount(promo.discount)}
                </Badge>
                {isExpiringSoon() && (
                  <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
                    ⚠️ Expire bientôt
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 mr-1" />
                {promo.partner}
              </div>
            </div>

            <CardTitle className="text-3xl font-bold mb-4">
              {promo.title}
            </CardTitle>

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <Clock className="w-4 h-4 mr-1 ml-4" />
              {isExpiringSoon() ? '⚠️ Expire bientôt - ' : ''}Valide jusqu'au {new Date(promo.valid_until).toLocaleDateString()}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Image */}
            {promo.image_url && (
              <div className="mb-6">
                <img
                  src={promo.image_url}
                  alt={promo.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-3">Description de l'offre</h3>
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: promo.description 
                }}
              />
            </div>

            {/* Code Promo Section */}
            <div className={`rounded-lg p-6 border-2 ${
              isExpiringSoon() 
                ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' 
                : 'bg-muted border-border'
            }`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Percent className="w-5 h-5 mr-2 text-primary" />
                Votre code promo
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Code à utiliser :</p>
                  <p className={`font-mono font-bold text-2xl ${
                    isExpiringSoon() 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-primary'
                  }`}>
                    {promo.code}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={copyCode}
                  className="ml-4"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleUsePromo}
                  className="flex-1"
                  disabled={!promo.website_url}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Utiliser sur le site partenaire
                </Button>
              </div>

              {!promo.website_url && (
                <p className="text-sm text-muted-foreground mt-2">
                  Aucun lien vers le site partenaire disponible. Utilisez le code directement sur le site.
                </p>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              <div>
                <h4 className="font-semibold mb-2">Partenaire</h4>
                <p className="text-muted-foreground">{promo.partner}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Catégorie</h4>
                <p className="text-muted-foreground">{promo.category}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Réduction</h4>
                <p className="text-muted-foreground">{formatDiscount(promo.discount)}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Validité</h4>
                <p className={`${isExpiringSoon() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}`}>
                  Jusqu'au {new Date(promo.valid_until).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoDetail;
