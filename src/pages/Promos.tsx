import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PromoCard from "@/components/PromoCard";
import { Search, Filter, Percent } from "lucide-react";

const Promos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Données d'exemple - à remplacer par des données réelles
  const promos = [
    {
      title: "Réduction cinéma UGC",
      description: "Bénéficiez de 30% de réduction sur vos places de cinéma UGC dans tous les cinémas de France",
      code: "CSE2024UGC",
      discount: "-30%",
      validUntil: "31/12/2024",
      partner: "UGC Cinémas",
      category: "Loisirs",
      image: "/placeholder.svg"
    },
    {
      title: "Vacances Center Parcs",
      description: "Jusqu'à 25% de réduction sur vos séjours Center Parcs en famille, week-ends et vacances",
      code: "CENTERPARCS25",
      discount: "-25%",
      validUntil: "28/02/2025",
      partner: "Center Parcs",
      category: "Vacances",
      image: "/placeholder.svg"
    },
    {
      title: "Carte restaurant Ticket Restaurant",
      description: "15% de bonus sur votre carte Ticket Restaurant pour tous vos repas",
      code: "RESTO15CSE",
      discount: "+15%",
      validUntil: "31/12/2024",
      partner: "Edenred",
      category: "Restauration",
      image: "/placeholder.svg"
    },
    {
      title: "Abonnement salle de sport",
      description: "50% de réduction sur votre abonnement annuel dans les salles Basic Fit",
      code: "BASICFIT50",
      discount: "-50%",
      validUntil: "15/11/2024",
      partner: "Basic Fit",
      category: "Sport",
      image: "/placeholder.svg"
    },
    {
      title: "Voyages SNCF Connect",
      description: "20% de réduction sur tous vos billets de train avec SNCF Connect",
      code: "SNCFCSE20",
      discount: "-20%",
      validUntil: "30/12/2024",
      partner: "SNCF",
      category: "Transport",
      image: "/placeholder.svg"
    },
    {
      title: "Spectacles Fnac",
      description: "Tarif préférentiel sur tous les spectacles et concerts via Fnac Spectacles",
      code: "FNACSPEC",
      discount: "-35%",
      validUntil: "31/01/2025",
      partner: "Fnac",
      category: "Culture",
      image: "/placeholder.svg"
    },
    {
      title: "Courses Carrefour",
      description: "10% de réduction sur vos courses en ligne Carrefour avec livraison gratuite",
      code: "CARREFOUR10",
      discount: "-10%",
      validUntil: "30/11/2024",
      partner: "Carrefour",
      category: "Alimentation",
      image: "/placeholder.svg"
    },
    {
      title: "Locations Europcar",
      description: "Jusqu'à 40% de réduction sur vos locations de véhicules Europcar",
      code: "EUROPCAR40",
      discount: "-40%",
      validUntil: "31/03/2025",
      partner: "Europcar",
      category: "Transport",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["all", "Loisirs", "Vacances", "Restauration", "Sport", "Transport", "Culture", "Alimentation"];

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
                {categories.slice(1).map(category => (
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
          {filteredPromos.map((promo, index) => (
            <PromoCard key={index} {...promo} />
          ))}
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