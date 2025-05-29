
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountDetails = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" value={user.email} readOnly />
    </div>
  );
};

export default AccountDetails;
