import React, { createContext, useState, useContext, useEffect } from "react";
import { WebSocketContext } from "./WebSocketProvider";

interface UserContextProps {
    userId: string;
    setUserId: (id: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
    const [userId, setUserId] = useState<string>("");
    const { addUserConnection } = useContext(WebSocketContext);

    useEffect(() => {
        if (userId) {
            addUserConnection(userId);
        }
    }, [userId, addUserConnection]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
