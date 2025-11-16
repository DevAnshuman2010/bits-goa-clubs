import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import CalendarView from "@/components/CalendarView";
import MyClubs from "@/components/MyClubs";
import ClubGuide from "@/components/ClubGuide";

type TabType = "calendar" | "my-clubs" | "club-guide";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("calendar");

  const renderContent = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView />;
      case "my-clubs":
        return <MyClubs />;
      case "club-guide":
        return <ClubGuide />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
