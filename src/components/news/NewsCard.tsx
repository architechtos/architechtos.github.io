
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  source?: string;
}

interface NewsCardProps {
  item: NewsItem;
  showReadMore?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, showReadMore = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return `${content.slice(0, maxLength)}...`;
  };

  return (
    <Card className="news-card overflow-hidden h-full flex flex-col">
      {item.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-strays-dark-orange line-clamp-2">
          {item.title}
        </CardTitle>
        <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-gray-700 text-sm">
          {showReadMore ? (
            <div>
              {isExpanded ? item.content : truncateContent(item.content)}
              {item.content.length > 150 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-strays-orange hover:underline ml-1 font-medium"
                >
                  {isExpanded ? "Λιγότερα" : "Περισσότερα"}
                </button>
              )}
            </div>
          ) : (
            <>
              {truncateContent(item.content)}
              <div className="mt-3">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={`/news/${item.id}`} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Διαβάστε περισσότερα
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {item.source && (
          <div className="text-xs text-gray-500">
            Πηγή: {item.source}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
