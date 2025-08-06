'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Openings } from "../../generated/prisma"

export function SearchInput() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Openings[]>([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  async function getSuggestions() {
    const res = await fetch("http://localhost:3000/api/search/suggestion?q=" + input);
    const data = await res.json();

    if (data.success) {
      setSuggestions(data.suggestions);
      console.log(data.suggestions);
    } else {
      setSuggestions([]);
    }
  }

  let x: ReturnType<typeof setTimeout>;
  
  if (input) {
    x = setTimeout(() => {
      setLoading(true);
      getSuggestions();
      setLoading(false);
    }, 800);
  } else {
    setSuggestions([]);
  }

  return () => {
    if (x) clearTimeout(x);
  };
}, [input]);

  return (
    <section className="relative w-full">
      <form className="flex w-full max-w-sm items-center gap-2" action={"/jobs"} method="GET">
        <Input type="text" value={input} name="q" placeholder="jobs..." onChange={e => setInput(e.target.value)} className="w-xl" autoComplete="off" />
        <Button type="submit" variant="outline">
          <Search />
        </Button>
      </form>
      {/* {
        loading && <div className="absolute w-full bg-muted p-5 flex flex-col justify-center items-center">{
          <div className="animate-spin"><Loader2 /></div>
        }</div>
      }
      {
        !loading && */}
        {
          suggestions.length>0&&
        <div className="absolute w-full bg-muted p-5 flex flex-col gap-2">{
          suggestions.map(elem => {
            return <p key={elem.id} className="truncate">{elem.title}</p>
          })
        }
        </div>
        }
      {/* } */}
    </section>
  )
}
