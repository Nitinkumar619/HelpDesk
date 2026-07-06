import React, { useEffect, useState } from "react";
import { 
  Ticket, 
  ShieldCheck, 
  Clock, 
  MessagesSquare, 
  Laptop, 
  Wifi, 
  Building, 
  Key, 
  Home, 
  BookOpen 
} from "lucide-react";

const FloatingIcons = () => {
  const [icons, setIcons] = useState([]);
  
  useEffect(() => {
    // Create array of icon elements with random positions and movements
    const iconComponents = [
      Ticket, Clock, MessagesSquare, 
      Wifi, Building, Key, Home, BookOpen
    ];
    
    const newIcons = Array.from({ length: 9 }, (_, i) => {
      const IconComponent = iconComponents[i % iconComponents.length];
      
      return {
        id: i,
        x: Math.random() * 100, // random position (percent of screen width)
        y: Math.random() * 100, // random position (percent of screen height)
        size: Math.random() * 20 + 30, // random size between 30-54px
        opacity: Math.random() * 0.5 + 0.3, // random opacity between 0.3-0.8
        speedX: (Math.random() - 0.5) * 0.05, // slower horizontal movement
        speedY: (Math.random() - 0.5) * 0.05, // slower vertical movement
        component: IconComponent,
        color: `rgba(${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.random() * 0.4 + 0.4})`,
      };
    });
    
    setIcons(newIcons);
    
    // Animation frame for movement
    let animationFrameId;
    let lastTimestamp = 0;
    
    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      setIcons(prevIcons => prevIcons.map(icon => {
        let newX = icon.x + icon.speedX * delta;
        let newY = icon.y + icon.speedY * delta;
        
        // Bounce off edges
        if (newX < 0 || newX > 100) icon.speedX *= -1;
        if (newY < 0 || newY > 100) icon.speedY *= -1;
        
        // Keep within bounds
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));
        
        return {
          ...icon,
          x: newX,
          y: newY
        };
      }));
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(icon => {
        const IconComponent = icon.component;
        return (
          <div
            key={icon.id}
            className="absolute transition-transform duration-1000"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <IconComponent 
              size={icon.size} 
              style={{ 
                opacity: icon.opacity,
                color: icon.color
              }} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;