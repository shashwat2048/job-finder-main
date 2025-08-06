import Link from "next/link";
import { HeaderDropdown } from "./headerDropdown";
import { ModeToggle } from "./modeToggleBtn";
import { SearchInput } from "./searchInput";
import Image from "next/image";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container-padding h-16 flex items-center justify-between">
                <Link href="/" className="flex gap-3 items-center text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/60 transition-all duration-300">
                    <Image src="/briefcase.png" alt="Job Search" width={32} height={32} />
                    <h1 className="text-2xl font-bold pt-1">Job Search</h1>
                </Link>
                
                <div className="flex items-center gap-4">
                    <SearchInput />
                    <ModeToggle />
                    <HeaderDropdown />
                </div>
            </div>
        </header>
    )
}