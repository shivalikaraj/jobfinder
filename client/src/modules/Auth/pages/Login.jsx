import Navbar from "@/components/Navbar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/features/authSlice"
import { loginCompany, loginJobSeeker } from "@/api"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { setCompany } from "@/features/companySlice"
import Footer from "@/components/Footer"

const Login = () => {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((state) => state.auth);
    const { company } = useSelector((state) => state.company);
    const navigate = useNavigate();

    // State object for job seeker data
    const [jobSeekerData, setJobSeekerData] = useState({
        email: "",
        password: ""
    });

    // State object for company  data
    const [companyData, setCompanyData] = useState({
        email: "",
        password: ""
    });

    //Handle input change for job seeker 
    const handleJobSeekerChange = (e) => {
        const { name, value } = e.target;
        setJobSeekerData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    //Handle input change for company
    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    //Handle login for job seeker
    const handleSubmitJobSeeker = async (e) => {
        e.preventDefault();

        dispatch(setLoading(true));
        try {
            const response = await loginJobSeeker(jobSeekerData);
            if (response.data.success) {
                dispatch(setUser(response.data.user))
                navigate("/")
                toast.success(response.data.message || "Login successfully!")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            dispatch(setLoading(false));
        }
    }

    //Handle login for company
    const handleSubmitCompany = async (e) => {
        e.preventDefault();

        dispatch(setLoading(true));
        try {
            const response = await loginCompany(companyData);
            if (response.data.success) {
                dispatch(setCompany(response.data.company))
                navigate("/")
                toast.success(response.data.message || "Login successfully!")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            dispatch(setLoading(false));
        }
    }

    //Navigate to home if already logged in
    useEffect(() => {
        if (user || company) {
            navigate("/");
        }
    });

    return (
        <>
            <Navbar />

            <Tabs defaultValue="job-seeker" className="mx-auto max-w-sm my-20 ">
                <TabsList className="w-full">
                    <TabsTrigger value="job-seeker" className="w-1/2">Job Seeker</TabsTrigger>
                    <TabsTrigger value="company" className="w-1/2">Company</TabsTrigger>
                </TabsList>

                <div className="mx-auto max-w-sm border border-gray-200 rounded-md p-10 my-5">
                    <h1 className="font-bold text-xl mb-5">Login</h1>

                    <TabsContent value="job-seeker">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="max@example.com"
                                    value={jobSeekerData.email}
                                    onChange={handleJobSeekerChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={jobSeekerData.password}
                                    onChange={handleJobSeekerChange}
                                />
                            </div>
                            {
                                loading ?
                                    <Loader2 className="w-full mt-2 animate-[spin_3s_linear_infinite]" /> :
                                    <Button type="submit" className="w-full" onClick={handleSubmitJobSeeker}>
                                        Login
                                    </Button>
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="company">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="company@example.com"
                                    value={companyData.email}
                                    onChange={handleCompanyChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={companyData.password}
                                    onChange={handleCompanyChange}
                                />
                            </div>

                            {
                                loading ?
                                    <Loader2 className="w-full mt-2 animate-[spin_3s_linear_infinite]" /> :
                                    <Button type="submit" className="w-full" onClick={handleSubmitCompany}>
                                        Login
                                    </Button>
                            }

                        </div>
                    </TabsContent>

                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Register
                        </Link>
                    </div>
                </div>
            </Tabs>
            <Footer />
        </>
    )
}

export default Login