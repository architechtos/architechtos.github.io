
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const sendVerificationCode = () => {
    if (phone.length < 10) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε έναν έγκυρο αριθμό τηλεφώνου",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending code
    setTimeout(() => {
      setIsSending(false);
      setCodeSent(true);
      toast({
        title: "Επιτυχία",
        description: "Ο κωδικός επαλήθευσης στάλθηκε στο τηλέφωνό σας",
      });
    }, 1500);
  };

  const verifyCode = () => {
    if (code.length !== 6) {
      toast({
        title: "Σφάλμα",
        description: "Ο κωδικός επαλήθευσης πρέπει να είναι 6 ψηφία",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Επιτυχία",
        description: "Το τηλέφωνό σας επαληθεύτηκε με επιτυχία",
      });
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Το Προφίλ μου</h1>
      
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
              <div className="space-y-2">
                <Label htmlFor="username">Όνομα Χρήστη</Label>
                <Input id="username" value={user.username} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly />
              </div>
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
              {user.phoneVerified ? (
                <Alert className="bg-green-50 border-green-200">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                  <AlertTitle>Επαληθευμένο</AlertTitle>
                  <AlertDescription>
                    Ο αριθμός τηλεφώνου σας έχει επαληθευτεί.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Αριθμός Τηλεφώνου</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="phone"
                        placeholder="69xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={codeSent}
                      />
                      {!codeSent && (
                        <Button 
                          onClick={sendVerificationCode} 
                          disabled={isSending || phone.length < 10}
                        >
                          {isSending ? "Αποστολή..." : "Αποστολή κωδικού"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {codeSent && (
                    <div className="space-y-2">
                      <Label htmlFor="code">Κωδικός Επαλήθευσης</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="code"
                          placeholder="6-ψήφιος κωδικός"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          maxLength={6}
                        />
                        <Button 
                          onClick={verifyCode} 
                          disabled={isVerifying || code.length !== 6}
                        >
                          {isVerifying ? "Επαλήθευση..." : "Επαλήθευση"}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Εισάγετε τον 6-ψήφιο κωδικό που στάλθηκε στο τηλέφωνό σας
                      </p>
                    </div>
                  )}

                  {codeSent && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-strays-orange"
                      onClick={() => {
                        setCodeSent(false);
                        setCode('');
                      }}
                    >
                      Αλλαγή αριθμού τηλεφώνου
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Δραστηριότητα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Αναφορές αδέσποτων</h4>
                    <p className="text-sm text-gray-500">Συνολικές αναφορές</p>
                  </div>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Συζητήσεις</h4>
                    <p className="text-sm text-gray-500">Συμμετοχές σε συζητήσεις</p>
                  </div>
                  <span className="text-2xl font-bold">0</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Όλη η δραστηριότητα</Button>
            </CardFooter>
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
    </div>
  );
};

export default ProfilePage;
