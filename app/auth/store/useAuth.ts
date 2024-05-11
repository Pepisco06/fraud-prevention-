import { create } from "zustand";
import userService, { UserType } from "@/app/services/userService";
import { useEffect } from "react";

type AgentType = { os: { version: string; name: string } };

interface AuthStore {
  userInfo?: {
    agent: AgentType;
    user: UserType;
  };
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  signInWithGoogle: () => void;
  setUserInfo: (userData: UserType, agent: AgentType) => void;
  signIn: (userData: UserType, cb: (text: string, data?: any) => void) => void;
  signOut: () => void;
}

const defaultValues = {
  userInfo: undefined,
  isAuthenticated: false,
  isAuthenticating: false,
};

const useAuth = create<AuthStore>((set) => {
  return {
    ...defaultValues,

    setUserInfo: (userData: UserType, agent: AgentType) =>
      set((store) => ({
        ...store,
        userInfo: {
          user: userData,
          agent: agent,
        },
        isAuthenticated: true,
        isAuthenticating: false,
      })),

    signIn: async (credentials: UserType, cb) => {
      let errorMessage = "";

      set((store) => ({
        ...store,
        isAuthenticating: true,
      }));

      try {
        // Make API call to backend auth endpoint using axios
        const data = await userService.post({
          email: credentials.email,
          password: credentials.password,
        });

        if (data.error) {
          errorMessage = data.error.message;

          set((store) => ({
            ...store,
            isAuthenticated: false,
            isAuthenticating: false,
          }));

          return cb(errorMessage);
        }

        if (data.message) {
          if (data.message.includes("Verification code")) {
            errorMessage = data.message;

            set((store) => ({
              ...store,
              isAuthenticated: false,
              isAuthenticating: false,
            }));

            return cb(errorMessage, { code: data.code });
          }
        }

        console.log("DATAAAA", data);
        set((store) => ({
          ...store,
          userInfo: {
            user: data.user,
            agent: data.agent,
          },
          isAuthenticated: true,
          isAuthenticating: false,
        }));
      } catch (error) {
        console.log("ERRRORRR", error);
        errorMessage = "Something went wrong";

        set((store) => ({
          ...store,
          isAuthenticating: false,
        }));
      }

      cb(errorMessage);
    },

    signOut: () => {
      set(() => defaultValues);
    },

    signInWithGoogle: async () => {},
  };
});

export default useAuth;
