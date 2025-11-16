import { useState, useEffect } from "react";
import { BookOpen, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ClubDetail from "./ClubDetail";
import { useClubFollow } from "@/hooks/useClubFollow";

interface Club {
  id: string;
  name: string;
  category: string;
  logo: string;
  shortDescription: string;
  whatTheyDo: string;
  whyJoin: string[];
  whyNotJoin: string[];
  skillLevel: string;
  effort: string;
  idealPerson: string;
  exclusivity: string;
  pastEvents: string[];
}

const ClubGuide = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const { followedClubs, followClub, unfollowClub, isFollowing } = useClubFollow();

  useEffect(() => {
    fetch('/data/clubs.json')
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(err => console.error('Error loading clubs:', err));
  }, []);

  if (selectedClub) {
    return (
      <ClubDetail
        club={selectedClub}
        isFollowing={isFollowing(selectedClub.id)}
        onBack={() => setSelectedClub(null)}
        onToggleFollow={() => {
          if (isFollowing(selectedClub.id)) {
            unfollowClub(selectedClub.id);
          } else {
            followClub(selectedClub.id);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Club Guide</h1>
        <BookOpen className="w-8 h-8 text-primary" />
      </div>

      <p className="text-muted-foreground">
        Discover all {clubs.length} clubs and find your perfect match
      </p>

      <div className="grid gap-4">
        {clubs.map((club) => (
          <Card key={club.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{club.logo}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{club.name}</CardTitle>
                    <Badge variant="secondary">{club.category}</Badge>
                  </div>
                  <CardDescription>{club.shortDescription}</CardDescription>
                  {isFollowing(club.id) && (
                    <Badge variant="default" className="mt-2">Following</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setSelectedClub(club)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClubGuide;
