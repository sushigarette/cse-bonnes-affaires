import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArticleCard from "@/components/ArticleCard";
import { Search, Filter } from "lucide-react";

const Articles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Données d'exemple - à remplacer par des données réelles
  const articles = [
    {
      title: "Nouvelle convention collective signée",
      content: "Une nouvelle convention collective a été signée avec la direction, apportant de nombreux avantages pour les salariés. Cette convention améliore les conditions de travail, les congés payés et les primes...",
      author: "Comité CSE",
      date: "15 Sept 2024",
      category: "Social",
      image: "/placeholder.svg"
    },
    {
      title: "Organisation de la soirée de fin d'année",
      content: "Le CSE organise la soirée de fin d'année pour tous les collaborateurs. L'événement aura lieu le 15 décembre au Grand Hôtel. Inscription obligatoire avant le 30 septembre...",
      author: "Bureau CSE",
      date: "12 Sept 2024",
      category: "Événement",
      image: "/placeholder.svg"
    },
    {
      title: "Nouveaux horaires de la cantine d'entreprise",
      content: "À partir du 1er octobre, la cantine d'entreprise élargit ses horaires d'ouverture pour mieux s'adapter aux besoins des équipes. Service continu de 11h30 à 14h30...",
      author: "Service RH",
      date: "10 Sept 2024",
      category: "Pratique",
      image: "/placeholder.svg"
    },
    {
      title: "Programme de formation continue 2024",
      content: "Découvrez le nouveau programme de formation continue proposé par l'entreprise. Plus de 50 formations disponibles dans différents domaines : management, technique, langues...",
      author: "Formation RH",
      date: "08 Sept 2024",
      category: "Formation",
      image: "/placeholder.svg"
    },
    {
      title: "Télétravail : nouvelles modalités",
      content: "Suite aux négociations avec le CSE, de nouvelles modalités de télétravail entrent en vigueur. Jusqu'à 3 jours par semaine selon les postes et avec accord du manager...",
      author: "Direction RH",
      date: "05 Sept 2024",
      category: "Social",
      image: "/placeholder.svg"
    },
    {
      title: "Journée portes ouvertes famille",
      content: "Le CSE organise une journée portes ouvertes le 20 octobre pour permettre aux familles de découvrir l'entreprise. Visite des locaux, démonstrations et animations prévues...",
      author: "Comité CSE",
      date: "03 Sept 2024",
      category: "Événement",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["all", "Social", "Événement", "Pratique", "Formation"];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Articles & Actualités</h1>
          <p className="text-lg text-muted-foreground">
            Restez informé de toutes les actualités de l'entreprise et du CSE
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-card rounded-lg border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un article..."
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
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={index}
              {...article}
              onRead={() => console.log('Lire article:', article.title)}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
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

export default Articles;