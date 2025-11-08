import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  return (
    <Card className="w-full aspect-video rounded-2xl border border-border bg-background shadow-none hover:shadow-none transition-all flex flex-col justify-center items-center text-center p-6 space-y-4">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-md">
          <AvatarImage
            src={"https://github.com/shadcn.png"}
            alt={user?.name || "User"}
          />
          <AvatarFallback className="text-lg font-semibold">
            {user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold capitalize text-foreground">
          {user?.name || "Anonymous User"}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">
          {user?.role || "Member"}
        </p>
      </div>

      <Separator className="w-1/3" />

      <div className="flex gap-2">
        <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
          Active
        </Badge>
        <Badge variant="outline" className="text-xs font-medium px-3 py-1">
          {user?.role || "User"}
        </Badge>
      </div>
    </Card>
  );
};

export default Profile;
