"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface DOMStyles {
  text: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
}

export interface TransitionData {
  isActive: boolean;
  isReady: boolean;
  bounds: DOMRect | null;
  styles: DOMStyles | null;
  sourceImage: HTMLImageElement | null;
  targetRoute: string | null;
  effectType: number;
  clickUv: { x: number; y: number } | null;
}

interface TransitionContextType {
  transitionData: TransitionData;
  setTransitionData: Dispatch<SetStateAction<TransitionData>>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
);

const initialTransitionData: TransitionData = {
  isActive: false,
  isReady: false,
  bounds: null,
  styles: null,
  sourceImage: null,
  targetRoute: null,
  effectType: 0,
  clickUv: null,
};

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [transitionData, setTransitionData] = useState<TransitionData>(
    initialTransitionData,
  );
  return (
    <TransitionContext.Provider value={{ transitionData, setTransitionData }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context)
    throw new Error("useTransition must be used within a TransitionProvider");
  return context;
};
