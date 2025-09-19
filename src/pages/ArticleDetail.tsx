import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Eye, Loader2 } from "lucide-react";
import { getArticleById, Article } from "@/lib/database";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const articleData = await getArticleById(id!);
      setArticle(articleData);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement de l'article...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Button onClick={() => navigate('/articles')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Bouton retour */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/articles')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux articles
          </Button>
        </div>

        {/* Article principal */}
        <Card className="card-elevated">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm">
                {article.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="w-4 h-4 mr-1" />
                {article.views || 0} vues
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold leading-tight mb-4">
              {article.title}
            </CardTitle>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.created_at)}
              </div>
            </div>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none">
            {article.image_url && (
              <div className="mb-6">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div 
              className="text-foreground leading-relaxed prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: article.content 
              }}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate('/articles')}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
