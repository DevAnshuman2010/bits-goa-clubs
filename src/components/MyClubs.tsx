import { Users, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MyClubs = () => {
  const clubs = [
    {
      id: 1,
      name: "Photography Club",
      description: "Capture moments, create memories",
      members: 45,
      role: "Member",
      nextEvent: "Today, 3:00 PM"
    },
    {
      id: 2,
      name: "Tech Club",
      description: "Building the future with code",
      members: 67,
      role: "Member",
      nextEvent: "Tomorrow, 4:30 PM"
    },
    {
      id: 3,
      name: "Book Club",
      description: "Adventures through pages",
      members: 32,
      role: "Admin",
      nextEvent: "Friday, 2:00 PM"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">My Clubs</h1>
        <Users className="w-8 h-8 text-primary" />
      </div>

      <div className="grid gap-4">
        {clubs.map((club) => (
          <Card key={club.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </div>
                {club.role === "Admin" && (
                  <Badge variant="default" className="ml-2">
                    <Star className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{club.members} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Next: {club.nextEvent}</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                View Club Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyClubs;
