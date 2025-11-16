import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClubFollow } from "@/hooks/useClubFollow";

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

const CalendarView = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { isFollowing } = useClubFollow();

  useEffect(() => {
    fetch('/data/events.json')
      .then(res => res.json())
      .then(data => {
        const sortedEvents = data.sort((a: Event, b: Event) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEvents(sortedEvents);
      })
      .catch(err => console.error('Error loading events:', err));
  }, []);

  const groupEventsByMonth = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    
    return grouped;
  };

  const groupedEvents = groupEventsByMonth(events);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <Calendar className="w-8 h-8 text-primary" />
      </div>

      <p className="text-muted-foreground">
        All upcoming events across campus clubs
      </p>
      
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([month, monthEvents]) => (
          <div key={month} className="space-y-3">
            <h2 className="text-xl font-semibold text-primary sticky top-0 bg-background py-2 z-10">
              {month}
            </h2>
            
            <div className="space-y-3">
              {monthEvents.map((event) => {
                const following = isFollowing(event.club);
                
                return (
                  <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className={`h-1 ${following ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{event.clubName}</Badge>
                          {following && (
                            <Badge variant="default">Following</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
