import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, User, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ArticleCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  articleUrl?: string;
  onRead?: () => void;
}

const ArticleCard = ({
  id,
  title,
  content,
  author,
  date,
  category,
  image,
  articleUrl,
  onRead
}: ArticleCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRead = () => {
    if (onRead) {
      onRead();
    }
    navigate(`/articles/${id}`);
  };

  const handleConsultArticle = () => {
    if (articleUrl) {
      let url = articleUrl.trim();
      if (!url.match(/^https?:\/\//)) {
        url = `https://${url}`;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "Lien non disponible",
        description: "Aucun lien externe n'est disponible pour cet article.",
        variant: "destructive"
      });
    }
  };
  return (
    <Card className="card-elevated hover:shadow-lg transition-all duration-300 group">
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {date}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        <div 
          className="text-muted-foreground line-clamp-3 text-sm leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
          }}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <User className="w-3 h-3 mr-1" />
          {author}
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
          
          {articleUrl && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleConsultArticle}
              className="text-primary hover:text-primary-foreground hover:bg-primary"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Consulter
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;