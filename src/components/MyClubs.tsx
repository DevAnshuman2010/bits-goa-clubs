import { useState, useEffect } from "react";
import { Users, Star, Megaphone, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useClubFollow } from "@/hooks/useClubFollow";

interface Club {
  id: string;
  name: string;
  category: string;
  logo: string;
  shortDescription: string;
}

interface Event {
  id: string;
  club: string;
  clubName: string;
  title: string;
  date: string;
  description: string;
  location: string;
  time: string;
}

const MyClubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [followedClubsData, setFollowedClubsData] = useState<Club[]>([]);
  const [followedEvents, setFollowedEvents] = useState<Event[]>([]);
  const { followedClubs, unfollowClub } = useClubFollow();

  useEffect(() => {
    Promise.all([
      fetch('/data/clubs.json').then(res => res.json()),
      fetch('/data/events.json').then(res => res.json())
    ]).then(([clubsData, eventsData]) => {
      setClubs(clubsData);
      setEvents(eventsData);
    });
  }, []);

  useEffect(() => {
    const followed = clubs.filter(club => followedClubs.includes(club.id));
    setFollowedClubsData(followed);

    const relevantEvents = events.filter(event => followedClubs.includes(event.club));
    setFollowedEvents(relevantEvents);
  }, [followedClubs, clubs, events]);

  const handleUnfollow = (clubId: string) => {
    unfollowClub(clubId);
  };

  if (followedClubs.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">My Clubs</h1>
          <Users className="w-8 h-8 text-primary" />
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Clubs Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start following clubs to see their updates here
            </p>
            <p className="text-sm text-muted-foreground">
              Go to Club Guide to explore and follow clubs
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">My Clubs</h1>
        <Users className="w-8 h-8 text-primary" />
      </div>

      {/* Followed Clubs Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Following ({followedClubsData.length})
        </h2>
        
        <div className="grid gap-3">
          {followedClubsData.map((club) => (
            <Card key={club.id} className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{club.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{club.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{club.category}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUnfollow(club.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Updates Feed Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Latest Updates
        </h2>

        {followedEvents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No upcoming events from your clubs</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {followedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Badge variant="secondary">{event.clubName}</Badge>
                      <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📅 {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })} at {event.time}</p>
                    <p>📍 {event.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClubs;
