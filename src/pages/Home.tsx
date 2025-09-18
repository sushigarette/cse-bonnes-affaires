import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";
import PromoCard from "@/components/PromoCard";
import { ArrowRight, TrendingUp, Gift, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import heroOffice from "@/assets/hero-office.jpg";
import meetingRoom from "@/assets/meeting-room.jpg";
import companyEvent from "@/assets/company-event.jpg";
import cinemaPromo from "@/assets/cinema-promo.jpg";
import centerparcsPromo from "@/assets/centerparcs-promo.jpg";

const Home = () => {
  // Données d'exemple - seront remplacées par des données réelles
  const recentArticles = [
    {
      title: "Nouvelle convention collective signée",
      content: "Une nouvelle convention collective a été signée avec la direction, apportant de nombreux avantages pour les salariés...",
      author: "Comité CSE",
      date: "15 Sept 2024",
      category: "Social",
      image: meetingRoom
    },
    {
      title: "Organisation de la soirée de fin d'année",
      content: "Le CSE organise la soirée de fin d'année pour tous les collaborateurs. Inscription obligatoire avant le 30 septembre...",
      author: "Bureau CSE",
      date: "12 Sept 2024",
      category: "Événement",
      image: companyEvent
    }
  ];

  const recentPromos = [
    {
      title: "Réduction cinéma UGC",
      description: "Bénéficiez de 30% de réduction sur vos places de cinéma UGC",
      code: "CSE2024UGC",
      discount: "-30%",
      validUntil: "31/12/2024",
      partner: "UGC Cinémas",
      category: "Loisirs",
      image: cinemaPromo
    },
    {
      title: "Vacances Center Parcs",
      description: "Jusqu'à 25% de réduction sur vos séjours Center Parcs en famille",
      code: "CENTERPARCS25",
      discount: "-25%",
      validUntil: "28/02/2025",
      partner: "Center Parcs",
      category: "Vacances",
      image: centerparcsPromo
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur le portail CSE
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Découvrez toutes les actualités, avantages et codes promo réservés aux collaborateurs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/articles">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <FileText className="w-5 h-5 mr-2" />
                Voir les articles
              </Button>
            </Link>
            <Link to="/promos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30 text-white">
                <Gift className="w-5 h-5 mr-2" />
                Codes promo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">24</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Articles publiés ce mois</p>
            </CardContent>
          </Card>

          <Card className="text-center gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-success">15</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Codes promo actifs</p>
            </CardContent>
          </Card>

          <Card className="text-center gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-warning">892</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Collaborateurs connectés</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Articles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Derniers articles</h2>
            <Link to="/articles">
              <Button variant="outline" className="group">
                Voir tous les articles
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentArticles.map((article, index) => (
              <ArticleCard
                key={index}
                {...article}
                onRead={() => console.log('Lire article:', article.title)}
              />
            ))}
          </div>
        </section>

        {/* Recent Promos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Codes promo du moment</h2>
            <Link to="/promos">
              <Button variant="outline" className="group">
                Voir tous les codes
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPromos.map((promo, index) => (
              <PromoCard key={index} {...promo} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;