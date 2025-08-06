import { Button } from "@/components/ui/button";
import { data } from "@/constants/data";
import db from "@/services/prisma";

export default function Page() {
    async function addData() {
        'use server';
        const newData = data.data.map(item => {
            return (
                {
                    title: item.job_title,
                    description: item.job_description,
                    salary: 100000,
                    location: item.job_location,
                    employment_type: "fulltime",
                    job_type: "remote"
                }
            )
        })
        try {
            await db.job.createMany({
                data: newData
            })
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button variant="default" onClick={addData} >Add Data to DB</Button>
    )
}