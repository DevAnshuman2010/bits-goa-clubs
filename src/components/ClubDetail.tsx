import { ArrowLeft, Users, TrendingUp, Zap, Award, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface ClubDetailProps {
  club: Club;
  isFollowing: boolean;
  onBack: () => void;
  onToggleFollow: () => void;
}

const ClubDetail = ({ club, isFollowing, onBack, onToggleFollow }: ClubDetailProps) => {
  const getSkillBadgeVariant = (level: string) => {
    switch (level) {
      case "Beginner": return "default";
      case "Medium": return "secondary";
      case "Tough": return "secondary";
      case "Extremely Competitive": return "destructive";
      default: return "default";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Low": return "text-green-600 dark:text-green-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";
      case "High": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getExclusivityBadge = (exclusivity: string) => {
    switch (exclusivity) {
      case "Open for All": return <Badge variant="default" className="mb-4">🌟 {exclusivity}</Badge>;
      case "Selective": return <Badge variant="secondary" className="mb-4">⭐ {exclusivity}</Badge>;
      case "Highly Selective": return <Badge variant="destructive" className="mb-4">🏆 {exclusivity}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Club Details</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardHeader className="text-center">
          <div className="text-6xl mb-3">{club.logo}</div>
          <CardTitle className="text-3xl">{club.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mx-auto mt-2">{club.category}</Badge>
          {getExclusivityBadge(club.exclusivity)}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              What They Do
            </h3>
            <p className="text-muted-foreground">{club.whatTheyDo}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Why You Should Join
            </h3>
            <ul className="space-y-2">
              {club.whyJoin.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Why You Might NOT Want to Join
            </h3>
            <ul className="space-y-2">
              {club.whyNotJoin.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 mt-0.5">✗</span>
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Skill Level Required
              </h3>
              <Badge variant={getSkillBadgeVariant(club.skillLevel)}>{club.skillLevel}</Badge>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Effort Needed
              </h3>
              <p className={`font-medium ${getEffortColor(club.effort)}`}>{club.effort}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">Type of Person Who Fits</h3>
            <p className="text-sm text-muted-foreground italic">{club.idealPerson}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Past Events Highlights
            </h3>
            <ul className="space-y-2">
              {club.pastEvents.map((event, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{event}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            className="w-full" 
            variant={isFollowing ? "outline" : "default"}
            onClick={onToggleFollow}
          >
            {isFollowing ? "Remove from My Clubs" : "Add to My Clubs"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;
