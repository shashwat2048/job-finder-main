'use client'
import { UserContext } from "@/app/(protected)/layout"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { User2, Bookmark } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext } from "react"

export function HeaderDropdown() {
    const router = useRouter();
    const {user}=useContext(UserContext);

    async function handleLogout(){
        try {
            const response = await fetch("/api/logout", {method: "POST"})
            const data = await response.json()
            
            if (data.success) {
                router.push("/login");
                router.refresh(); 
            } else {
                console.error("Logout failed:", data.message)
            }
        } catch (error) {
            console.error("Logout error:", error);
            router.push("/login");
            router.refresh();
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><User2/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {
                    user?.company?
                    <DropdownMenuItem>
                        <Link href={"/add-job"}>
                            + Add Job
                        </Link>
                    </DropdownMenuItem>
                    :
                    <DropdownMenuItem>
                        <Link href={"/add-company"}>
                            + Add Company
                        </Link>
                    </DropdownMenuItem>

                }
                {
                    user?.company&&
                    <DropdownMenuItem>
                        <Link href={"/company/"+ user.company.id}>
                            View Company
                        </Link>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem>
                    <Link href={"/applied-jobs"}>
                        View Applied Jobs
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={"/saved-jobs"} className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        Saved Jobs
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
