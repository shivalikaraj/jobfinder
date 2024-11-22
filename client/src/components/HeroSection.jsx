import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/features/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Handling search job by setting search query and navigting to browse
    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query))
        navigate(`/browse?keyword=${query}`)
    }

    return (
        <div className="flex flex-col gap-5 text-center bg-[#f5f8fd] py-28">
            <h1 className="font-bold text-5xl text=[#2C2C2C]">Connecting Talent with <span className="text-[#265aa2]">Opportunity.</span></h1>
            <p className="text-xl lg:px-80 py-10 ">Find your dream job or discover the perfect candidate. Empowering companies to post jobs and job seekers to find the right match effortlessly.</p>

            <div className="flex lg:w-[40%] shadow-md border border-gray-200 rounded-full items-center gap-4 mx-auto pl-5 h-14 bg-white">
                <input
                    type="text"
                    placeholder="Find your dream job"
                    className="outline-none boreder-none w-full "
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button className="rounded-r-full bg-[#235191] h-14 w-14">
                    <Search className="h-6 w-6" onClick={searchJobHandler} />
                </Button>
            </div>
        </div>
    )
}

export default HeroSection