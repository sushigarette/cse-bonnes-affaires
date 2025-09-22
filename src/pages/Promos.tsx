import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PromoCard from "@/components/PromoCard";
import { Search, Filter, Percent, Loader2 } from "lucide-react";
import { getPromos, Promo } from "@/lib/database";
import { formatDiscount } from "@/lib/formatDiscount";

const Promos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [promos, setPromos] = useState<Promo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromos();
  }, []);


  const loadPromos = async () => {
    try {
      const promosData = await getPromos();
      setPromos(promosData);
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(promosData.map(promo => promo.category))]
        .filter(category => category && category.trim() !== "");
      setCategories(uniqueCategories.sort());
    } catch (error) {
      console.error('Erreur lors du chargement des promos:', error);
    } finally {
      setLoading(false);
    }
  };


  const filteredPromos = promos.filter(promo => {
    const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.partner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || promo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <Percent className="w-10 h-10 mr-3 text-success" />
            Codes Promo & Avantages
          </h1>
          <p className="text-lg text-muted-foreground">
            Profitez des offres exclusives négociées par votre CSE
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-card rounded-lg border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une promo, un partenaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories
                  .filter(category => category && category.trim() !== "")
                  .map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredPromos.length} offre{filteredPromos.length > 1 ? 's' : ''} disponible{filteredPromos.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Promos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredPromos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Aucune offre trouvée</p>
            </div>
          ) : (
            filteredPromos.map((promo) => (
              <PromoCard
                key={promo.id}
                id={promo.id}
                title={promo.title}
                description={promo.description}
                code={promo.code}
                discount={formatDiscount(promo.discount)}
                validUntil={new Date(promo.valid_until).toLocaleDateString()}
                partner={promo.partner}
                category={promo.category}
                image={promo.image_url || "/placeholder.svg"}
                websiteUrl={promo.website_url}
                documentUrl={promo.document_url}
                onRead={() => console.log('Lire promo:', promo.title)}
              />
            ))
          )}
        </div>

        {/* Empty state */}
        {filteredPromos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucune offre trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promos;