'use client';
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu
} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";

export function AppSidebar() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const jt = searchParams.get('jt');
    const et = searchParams.get('et');
    const q = searchParams.get('q');
    const ms = searchParams.get("ms");

    const [jobType, setJobType] = useState(jt || "on-site");
    const [employmentType, setEmploymentType] = useState(et || "fulltime");
    const [minSalary, setMinSalary] = useState(Number(ms) || 100000);

    function handleSubmit() {
        const url = `/jobs?q=${q}&jt=${jobType}&et=${employmentType}&ms=${minSalary}`;
        router.push(url);
    }

    return (
        <Sidebar className="h-[calc(100vh-60px)] absolute top-15">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Job Filters</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-5 py-5">
                            <section className="flex flex-col gap-2 border p-2 rounded-md">
                                <h2>Employment Type</h2>
                                <RadioGroup defaultValue="full-time" value={employmentType}>
                                    <div className="flex items-center space-x-2" >
                                        <RadioGroupItem value="full-time" id="full-time" onClick={() => setEmploymentType("full-time")} />
                                        <Label htmlFor="full-time">Full Time</Label>
                                    </div>
                                    <div className="flex items-center space-x-2" >
                                        <RadioGroupItem value="part-time" id="part-time" onClick={() => setEmploymentType("part-time")} />
                                        <Label htmlFor="part-time">Part Time</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="contractor" id="contractor" onClick={() => setEmploymentType("contractor")} />
                                        <Label htmlFor="contractor">Contractor</Label>
                                    </div>
                                </RadioGroup>
                            </section>
                            <section className="flex flex-col gap-2 border p-2 rounded-md">
                                <h2>Job Type</h2>
                                <RadioGroup defaultValue="on-site">
                                    <div className="flex items-center space-x-2" >
                                        <RadioGroupItem value="remote" id="remote" onClick={() => setJobType("remote")} />
                                        <Label htmlFor="remote">Remote</Label>
                                    </div>
                                    <div className="flex items-center space-x-2" >
                                        <RadioGroupItem value="on-site" id="on-site" onClick={() => setJobType("on-site")} />
                                        <Label htmlFor="on-site">On Site</Label>
                                    </div>
                                </RadioGroup>
                            </section>
                            <section className="flex flex-col gap-3 border p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                    <h2>Minimum Salary</h2>
                                    <p className="font-semibold">
                                        ₹{minSalary.toLocaleString()}
                                    </p>
                                </div>
                                <Slider
                                    value={[minSalary]}
                                    max={1000000}
                                    step={10000} 
                                    onValueChange={(value) => setMinSalary(value[0])}
                                />
                            </section>
                            <Button variant="default" className="cursor-pointer" onClick={handleSubmit}>Go</Button>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}