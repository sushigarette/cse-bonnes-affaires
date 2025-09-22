import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";
import PromoCard from "@/components/PromoCard";
import { ArrowRight, Gift, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getArticles, getPromos, Article, Promo } from "@/lib/database";
import { formatDiscount } from "@/lib/formatDiscount";
import heroOffice from "@/assets/hero-office.jpg";
import meetingRoom from "@/assets/meeting-room.jpg";
import companyEvent from "@/assets/company-event.jpg";
import cinemaPromo from "@/assets/cinema-promo.jpg";
import centerparcsPromo from "@/assets/centerparcs-promo.jpg";

const Home = () => {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentPromos, setRecentPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    try {
      const [articlesData, promosData] = await Promise.all([
        getArticles(),
        getPromos()
      ]);

      // Prendre les 2 premiers articles et promos
      setRecentArticles(articlesData.slice(0, 2));
      setRecentPromos(promosData.slice(0, 2));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur MHCSE
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
            {loading ? (
              <div className="col-span-2 flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : recentArticles.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Aucun article disponible</p>
              </div>
            ) : (
              recentArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  content={article.content}
                  author={article.author}
                  date={new Date(article.created_at).toLocaleDateString()}
                  category={article.category}
                  image={article.image_url || "/placeholder.svg"}
                  articleUrl={article.article_url}
                  onRead={() => console.log('Lire article:', article.title)}
                />
              ))
            )}
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
            {loading ? (
              <div className="col-span-2 flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : recentPromos.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Aucun code promo disponible</p>
              </div>
            ) : (
              recentPromos.map((promo) => (
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
                  onRead={() => console.log('Lire promo:', promo.title)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;