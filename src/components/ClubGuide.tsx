import { BookOpen, Users, Trophy, Camera, Code, Book, Music, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ClubGuide = () => {
  const allClubs = [
    {
      id: 1,
      name: "Photography Club",
      description: "Learn photography techniques and capture stunning moments",
      members: 45,
      icon: Camera,
      category: "Arts",
      joined: true
    },
    {
      id: 2,
      name: "Tech Club",
      description: "Explore coding, robotics, and technology innovations",
      members: 67,
      icon: Code,
      category: "Technology",
      joined: true
    },
    {
      id: 3,
      name: "Book Club",
      description: "Discuss literature and share reading experiences",
      members: 32,
      icon: Book,
      category: "Literature",
      joined: true
    },
    {
      id: 4,
      name: "Music Club",
      description: "Create and perform music together",
      members: 38,
      icon: Music,
      category: "Arts",
      joined: false
    },
    {
      id: 5,
      name: "Art Club",
      description: "Express creativity through various art forms",
      members: 41,
      icon: Palette,
      category: "Arts",
      joined: false
    },
    {
      id: 6,
      name: "Sports Club",
      description: "Stay active and competitive in various sports",
      members: 89,
      icon: Trophy,
      category: "Sports",
      joined: false
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Club Guide</h1>
        <BookOpen className="w-8 h-8 text-primary" />
      </div>

      <p className="text-muted-foreground">
        Discover and join clubs that match your interests
      </p>

      <div className="grid gap-4">
        {allClubs.map((club) => {
          const Icon = club.icon;
          
          return (
            <Card key={club.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{club.name}</CardTitle>
                      <Badge variant="secondary">{club.category}</Badge>
                    </div>
                    <CardDescription>{club.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{club.members} members</span>
                </div>
                {club.joined ? (
                  <Button className="w-full" variant="outline" disabled>
                    Already Joined
                  </Button>
                ) : (
                  <Button className="w-full">
                    Join Club
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ClubGuide;
