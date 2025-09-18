import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, User } from "lucide-react";

interface ArticleCardProps {
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  onRead?: () => void;
}

const ArticleCard = ({
  title,
  content,
  author,
  date,
  category,
  image,
  onRead
}: ArticleCardProps) => {
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
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {content}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <User className="w-3 h-3 mr-1" />
          {author}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onRead}
          className="text-primary hover:text-primary-foreground hover:bg-primary"
        >
          <Eye className="w-4 h-4 mr-1" />
          Lire
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;