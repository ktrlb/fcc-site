import { Heart, BookOpen, Music, Briefcase, Utensils, GraduationCap, Settings, Users } from "lucide-react";

interface MinistryPlaceholderProps {
  ministryName: string;
  category: string;
}

// Function to get category-specific styling
function getCategoryStyling(category: string) {
  const categoryMap: Record<string, { icon: React.ComponentType<{ className?: string }>, colors: string, bgColors: string }> = {
    "Service & Ministry": { 
      icon: Heart, 
      colors: "text-red-500", 
      bgColors: "bg-gradient-to-br from-red-100 to-red-200" 
    },
    "Fellowship & Interest": { 
      icon: Users, 
      colors: "text-green-500", 
      bgColors: "bg-gradient-to-br from-green-100 to-green-200" 
    },
    "Discipleship & Education": { 
      icon: BookOpen, 
      colors: "text-purple-500", 
      bgColors: "bg-gradient-to-br from-purple-100 to-purple-200" 
    },
    "Children & Youth": { 
      icon: GraduationCap, 
      colors: "text-blue-500", 
      bgColors: "bg-gradient-to-br from-blue-100 to-blue-200" 
    },
    "Worship & Music": { 
      icon: Music, 
      colors: "text-indigo-500", 
      bgColors: "bg-gradient-to-br from-indigo-100 to-indigo-200" 
    },
    "Outreach & Service": { 
      icon: Heart, 
      colors: "text-pink-500", 
      bgColors: "bg-gradient-to-br from-pink-100 to-pink-200" 
    },
    "Hospitality": { 
      icon: Utensils, 
      colors: "text-orange-500", 
      bgColors: "bg-gradient-to-br from-orange-100 to-orange-200" 
    },
    "Administration": { 
      icon: Briefcase, 
      colors: "text-gray-500", 
      bgColors: "bg-gradient-to-br from-gray-100 to-gray-200" 
    },
    "Technology": { 
      icon: Settings, 
      colors: "text-cyan-500", 
      bgColors: "bg-gradient-to-br from-cyan-100 to-cyan-200" 
    },
    "Partner Organization": { 
      icon: Users, 
      colors: "text-yellow-500", 
      bgColors: "bg-gradient-to-br from-yellow-100 to-yellow-200" 
    }
  };

  return categoryMap[category] || { 
    icon: Users, 
    colors: "text-blue-500", 
    bgColors: "bg-gradient-to-br from-blue-100 to-blue-200" 
  };
}

export function MinistryPlaceholder({ ministryName, category }: MinistryPlaceholderProps) {
  const { icon: IconComponent, colors, bgColors } = getCategoryStyling(category);
  
  return (
    <div className={`w-full h-full ${bgColors} flex items-center justify-center`}>
      <div className="text-center">
        <IconComponent className={`h-12 w-12 ${colors} mx-auto mb-2`} />
        <p className={`${colors.replace('text-', 'text-').replace('-500', '-700')} font-medium text-sm px-2`}>
          {ministryName}
        </p>
      </div>
    </div>
  );
}
