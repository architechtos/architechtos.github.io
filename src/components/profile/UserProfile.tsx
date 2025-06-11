
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AccountDetails from "./AccountDetails";
import PhoneVerification from "./PhoneVerification";
import ProfileImageUpload from "./ProfileImageUpload";
import BioEditor from "./BioEditor";
import UserStats from "./UserStats";
import ActivityHistory from "./ActivityHistory";
import UserStrays from "./UserStrays";
import TeamBadges from "@/components/user/TeamBadges";

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleAvatarUpdate = (newUrl: string) => {
    setAvatarUrl(newUrl);
    refetchProfile();
  };

  const handleBioUpdate = (newBio: string) => {
    refetchProfile();
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Πρέπει να συνδεθείτε για να δείτε το προφίλ σας.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ProfileImageUpload 
              currentAvatarUrl={profile?.avatar_url || avatarUrl}
              onAvatarUpdate={handleAvatarUpdate}
            />
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <p className="text-gray-600">{user.email}</p>
              <TeamBadges userId={user.id} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats and Ranking */}
      <UserStats userId={user.id} />

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Λογαριασμός</TabsTrigger>
          <TabsTrigger value="activity">Δραστηριότητα</TabsTrigger>
          <TabsTrigger value="strays">Αδέσποτα</TabsTrigger>
          <TabsTrigger value="profile">Προφίλ</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountDetails />
          <PhoneVerification isVerified={user.phoneVerified || false} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityHistory userId={user.id} />
        </TabsContent>

        <TabsContent value="strays">
          <UserStrays userId={user.id} />
        </TabsContent>

        <TabsContent value="profile">
          <BioEditor 
            bio={profile?.bio || null}
            onBioUpdate={handleBioUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
