"use client";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";

interface AppContextParams {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const AppContext = createContext<AppContextParams | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        console.log("No active session found.");
        return;
      }
      console.log("Active session found:", session);
      setSession(session);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Changed:==<<>>", event, session);
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user.email);
        fetchSession(); // Fetch new session on sign-in
        // Fetch user data here if needed
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setSession(null);
        // Handle sign out logic here if needed
      }
    });
  }, []);

  const value = {
    session,
    setSession,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextParams => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
