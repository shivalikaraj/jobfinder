import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/features/jobSlice";

const filterData = [
  {
    filterType: "Industry",
    array: ["Construction", "Education", "Energy", "Finance", "Government", "Healthcare", "Hospitality", "Manufacturing", "Marketing", "Media", "Real Estate", "Retail", "Telecommunications", "Transportation"],
  },
  {
    filterType: "Job type",
    array: ["Full-time", "Part-time", "Freelance", "Internship", "Contract"],
  },
  {
    filterType: "Work Location",
    array: ["Remote", "On-Site", "Hybrid"],
  }
];

const JobFilters = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  //Handle value change in radio group
  const changeHandler = (value) => {
    setSelectedValue(value);
  }

  //Setting searched query to the value selected in filters
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue))
  }, [selectedValue])

  return (
    <div className="w-full bg-white px-10 py-6">
      <h1 className="pt-3 font-semibold text-lg">
        Filter Jobs
        <hr className="my-3" />
      </h1>
      
      <RadioGroup className="flex flex-col gap-3" value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-semibold text-md">{data.filterType}</h1>

            {data.array.map((item, idx) => {
              const itemId = `id${index - idx}`
              return (
                <div key={idx} className="flex items-center space-x-2 m-2">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default JobFilters