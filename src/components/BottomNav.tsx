import { Calendar, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "calendar" | "my-clubs" | "club-guide";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: "calendar" as TabType, icon: Calendar, label: "Calendar" },
    { id: "my-clubs" as TabType, icon: Users, label: "My Clubs" },
    { id: "club-guide" as TabType, icon: BookOpen, label: "Club Guide" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-300",
                "hover:bg-muted/50 rounded-lg min-w-[80px]",
                isActive && "text-primary"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
