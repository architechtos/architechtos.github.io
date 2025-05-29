
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

interface PhoneVerificationProps {
  isVerified: boolean;
}

export const PhoneVerification = ({ isVerified }: PhoneVerificationProps) => {
  const { toast } = useToast();
  const { verifyPhone } = useAuth();
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
        description: "Ο κωδικός επαλήθευσης στάλθηκε στο τηλέφωνό σας (Demo: χρησιμοποιήστε οποιοδήποτε 6-ψήφιο κωδικό)",
      });
    }, 1500);
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Σφάλμα",
        description: "Ο κωδικός επαλήθευσης πρέπει να είναι 6 ψηφία",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Use the auth context's verifyPhone function
      const success = await verifyPhone(phone, code);
      
      if (success) {
        toast({
          title: "Επιτυχία",
          description: "Το τηλέφωνό σας επαληθεύτηκε με επιτυχία",
        });
        // Reset form
        setCodeSent(false);
        setPhone('');
        setCode('');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Σφάλμα",
        description: "Προέκυψε σφάλμα κατά την επαλήθευση",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <div className="h-4 w-4 rounded-full bg-green-500" />
        <AlertTitle>Επαληθευμένο</AlertTitle>
        <AlertDescription>
          Ο αριθμός τηλεφώνου σας έχει επαληθευτεί.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {/* Demo notice */}
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <AlertDescription>
          <strong>Demo Mode:</strong> Εισάγετε οποιοδήποτε 6-ψήφιο κωδικό (π.χ. 123456) για επιβεβαίωση.
        </AlertDescription>
      </Alert>

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
              placeholder="Εισάγετε 6-ψήφιο κωδικό"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
              }}
              maxLength={6}
              type="tel"
            />
            <Button 
              onClick={verifyCode} 
              disabled={isVerifying || code.length !== 6}
            >
              {isVerifying ? "Επαλήθευση..." : "Επαλήθευση"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Demo Mode: Εισάγετε οποιοδήποτε 6-ψήφιο κωδικό (π.χ. 123456)
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
  );
};

export default PhoneVerification;
