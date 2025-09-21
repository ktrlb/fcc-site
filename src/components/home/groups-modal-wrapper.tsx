'use client';

import { useState, ReactNode } from 'react';
import { GroupsModal } from './groups-modal';

interface GroupsModalWrapperProps {
  children: ReactNode;
}

export function GroupsModalWrapper({ children }: GroupsModalWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      
      <GroupsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
