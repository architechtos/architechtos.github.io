
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserRank from "@/components/user/UserRank";
import AccountDetails from "@/components/profile/AccountDetails";
import PhoneVerification from "@/components/profile/PhoneVerification";
import ActivityHistory from "@/components/profile/ActivityHistory";
import UserStats from "@/components/profile/UserStats";
import UserStrays from "@/components/profile/UserStrays";
import BioEditor from "@/components/profile/BioEditor";
import AddressVerification from "@/components/profile/AddressVerification";
import TeamBadges from "@/components/user/TeamBadges";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const { user } = useAuth();

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

  const handleBioUpdate = (newBio: string) => {
    refetchProfile();
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <h1 className="text-2xl font-bold mb-2">Το Προφίλ μου</h1>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Λογαριασμός</TabsTrigger>
          <TabsTrigger value="strays">Τα αδεσποτάκια μου</TabsTrigger>
          <TabsTrigger value="activity">Δραστηριότητα</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Στοιχεία Λογαριασμού</CardTitle>
                  <CardDescription>
                    Προβολή και διαχείριση των στοιχείων του λογαριασμού σας
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AccountDetails />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Βιογραφικό</CardTitle>
                  <CardDescription>
                    Πείτε μας λίγα λόγια για εσάς
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BioEditor 
                    bio={profile?.bio || null} 
                    onBioUpdate={handleBioUpdate}
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Επαλήθευση Τηλεφώνου</CardTitle>
                  <CardDescription>
                    Επαληθεύστε τον αριθμό του τηλεφώνου σας για πρόσβαση σε όλες τις λειτουργίες
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PhoneVerification isVerified={user.phoneVerified} />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Επαλήθευση Διεύθυνσης</CardTitle>
                  <CardDescription>
                    Επαληθεύστε τη διεύθυνσή σας ανεβάζοντας λογαριασμό
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AddressVerification 
                    isVerified={profile?.address_verified}
                    status={profile?.address_verification_status}
                    documentUrl={profile?.address_verification_document_url}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Επίπεδο & Στατιστικά</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TeamBadges userId={user.id} />
                  <div className="flex justify-center">
                    <UserRank size="lg" />
                  </div>
                  <UserStats userId={user.id} />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Ειδοποιήσεις</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Δεν έχετε νέες ειδοποιήσεις.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strays">
          <Card>
            <CardHeader>
              <CardTitle>Οι Καταχωρήσεις μου</CardTitle>
              <CardDescription>
                Διαχειριστείτε τους αδέσποτους που έχετε καταχωρήσει
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserStrays userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Ιστορικό Δραστηριότητας</CardTitle>
              <CardDescription>
                Οι πρόσφατες δραστηριότητες και οι πόντοι που έχετε κερδίσει
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityHistory userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
