import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CalendarView = () => {
  const events = [
    {
      id: 1,
      title: "Photography Club Meeting",
      club: "Photography Club",
      date: "Today, 3:00 PM",
      location: "Room 204",
      color: "primary"
    },
    {
      id: 2,
      title: "Coding Workshop",
      club: "Tech Club",
      date: "Tomorrow, 4:30 PM",
      location: "Computer Lab",
      color: "secondary"
    },
    {
      id: 3,
      title: "Book Discussion",
      club: "Book Club",
      date: "Friday, 2:00 PM",
      location: "Library",
      color: "accent"
    },
    {
      id: 4,
      title: "Chess Tournament",
      club: "Chess Club",
      date: "Saturday, 10:00 AM",
      location: "Main Hall",
      color: "primary"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
        <Calendar className="w-8 h-8 text-primary" />
      </div>
      
      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <Badge variant="secondary" className="ml-2">{event.club}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
