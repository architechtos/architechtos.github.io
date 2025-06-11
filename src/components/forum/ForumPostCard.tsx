import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, Share } from "lucide-react";
import UserProfileModal from "@/components/profile/UserProfileModal";

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_id: string;
  username?: string;
  comment_count?: number;
  like_count?: number;
}

interface ForumPostCardProps {
  thread: ForumThread;
  onLike: (threadId: string) => void;
  onShare: (threadId: string) => void;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({ thread, onLike, onShare }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('el-GR', options);
    } catch (e) {
      return dateString;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general':
        return { label: 'Γενικά', color: 'bg-blue-100 text-blue-800' };
      case 'help':
        return { label: 'Βοήθεια', color: 'bg-red-100 text-red-800' };
      case 'suggestions':
        return { label: 'Προτάσεις', color: 'bg-green-100 text-green-800' };
      default:
        return { label: category, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const category = getCategoryLabel(thread.category);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{thread.title}</CardTitle>
              <CardDescription>
                <span>
                  από{" "}
                  <button 
                    onClick={() => setShowUserProfile(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {thread.username}
                  </button>
                  {" "}• {formatDate(thread.created_at)}
                </span>
              </CardDescription>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
              {category.label}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {thread.content.length > 200 
              ? `${thread.content.substring(0, 200)}...` 
              : thread.content}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600">
              <MessageSquare className="mr-1 h-4 w-4" /> {thread.comment_count || 0}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600" onClick={() => onLike(thread.id)}>
              <Heart className="mr-1 h-4 w-4" /> {thread.like_count || 0}
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600" onClick={() => onShare(thread.id)}>
              <Share className="mr-1 h-4 w-4" /> Κοινοποίηση
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Ανάγνωση
          </Button>
        </CardFooter>
      </Card>

      {showUserProfile && thread.user_id && (
        <UserProfileModal 
          userId={thread.user_id}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </>
  );
};
