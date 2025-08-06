'use client'
import Header from "@/components/header";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Company, User } from "../../../generated/prisma";

export const UserContext = createContext<
    {
        user?: User & { company: Company } | null,
        setUser?: (value: User & { company: Company }) => void
    }
>({});
export default function Layout({ children }: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User & { company: Company } | null>(null);
    useEffect(() => {
        async function getUser() {
            const res = await fetch("http://localhost:3000/api/current-user");
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            }
        }
        getUser();
    }, []);
    return (
        <div className="">
            <UserContext.Provider value={{ user, setUser }}>
                <Header />
                {children}
                <Toaster position="top-center" />
            </UserContext.Provider>
        </div>
    )
}