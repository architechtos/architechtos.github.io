
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

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
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  };

  const shareUrl = `https://voithia-adespota.gr/news/${item.id}`;

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(item.title + ' ' + window.location.href)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Ο σύνδεσμος αντιγράφηκε",
          description: "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο",
        });
        break;
    }
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return `${content.slice(0, maxLength)}...`;
  };

  return (
    <Card className="news-card overflow-hidden">
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
        <CardTitle className="text-xl text-strays-dark-orange">{item.title}</CardTitle>
        <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700">
          {isExpanded ? item.content : truncateContent(item.content)}
          {item.content.length > 150 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-strays-orange hover:underline ml-1 font-medium text-sm"
            >
              {isExpanded ? "Λιγότερα" : "Περισσότερα"}
            </button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {item.source && (
          <div className="text-xs text-gray-500">
            Πηγή: {item.source}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <Share className="mr-2 h-4 w-4" /> 
              Κοινοποίηση
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare('facebook')}>
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')}>
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('copy')}>
              Αντιγραφή συνδέσμου
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
