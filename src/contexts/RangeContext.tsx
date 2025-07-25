import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SimpleActionButton {
  type: 'simple';
  id: string;
  name: string;
  color: string;
  isFontAdaptive?: boolean;
  fontSize?: number;
  fontColor?: 'white' | 'black';
}

export interface WeightedActionButton {
  type: 'weighted';
  id: string;
  name: string;
  action1Id: string;
  action2Id:string;
  weight: number; // 0-100 for action1
}

export type ActionButton = SimpleActionButton | WeightedActionButton;


interface Range {
  id: string;
  name: string;
  hands: Record<string, string>;
}

interface Folder {
  id: string;
  name: string;
  ranges: Range[];
}

interface RangeContextType {
  folders: Folder[];
  actionButtons: ActionButton[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  setActionButtons: React.Dispatch<React.SetStateAction<ActionButton[]>>;
}

const RangeContext = createContext<RangeContextType | undefined>(undefined);

export const useRangeContext = () => {
  const context = useContext(RangeContext);
  if (!context) {
    throw new Error('useRangeContext must be used within a RangeProvider');
  }
  return context;
};

export const RangeProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('poker-ranges-folders');
    return saved ? JSON.parse(saved) : [{
      id: '1',
      name: 'Folder',
      ranges: [
        {
          id: '1',
          name: 'Range',
          hands: {}
        }
      ]
    }];
  });
  
  const [actionButtons, setActionButtons] = useState<ActionButton[]>(() => {
    const saved = localStorage.getItem('poker-ranges-actions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((btn: any) => {
        if (!btn.type) {
          // Old format, migrate to new simple button format
          return { 
            ...btn, 
            type: 'simple',
            isFontAdaptive: true,
            fontSize: 12,
            fontColor: 'white'
          };
        }
        return btn;
      });
    }
    // Default button with new font settings
    return [{ 
      type: 'simple', 
      id: 'raise', 
      name: 'Raise', 
      color: '#8b5cf6',
      isFontAdaptive: true,
      fontSize: 12,
      fontColor: 'white'
    }];
  });

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('poker-ranges-folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('poker-ranges-actions', JSON.stringify(actionButtons));
  }, [actionButtons]);

  return (
    <RangeContext.Provider value={{ folders, actionButtons, setFolders, setActionButtons }}>
      {children}
    </RangeContext.Provider>
  );
};
