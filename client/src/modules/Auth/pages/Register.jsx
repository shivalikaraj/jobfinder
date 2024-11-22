import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setLoading } from "@/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { signupCompany, signupJobSeeker } from "@/api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Footer from "@/components/Footer";

const Register = () => {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((state) => state.auth);
    const { company } = useSelector((state) => state.company)
    const navigate = useNavigate();

    // State object for job seeker data
    const [jobSeekerData, setJobSeekerData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: ""
    });

    // State object for company data
    const [companyData, setCompanyData] = useState({
        companyName: "",
        industry: "",
        location: "",
        email: "",
        password: ""
    });

    // Handle input change for job seeker form
    const handleJobSeekerChange = (e) => {
        const { name, value } = e.target;
        setJobSeekerData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle input change for company form
    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle job seeker form submission
    const handleSubmitJobSeeker = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await signupJobSeeker(jobSeekerData);
            if (response.data.success) {
                navigate("/login");
                toast.success("Registered successfully!");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Handle company form submission
    const handleSubmitCompany = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const response = await signupCompany(companyData);
            if (response.data.success) {
                navigate("/login");
                toast.success("Registered successfully!");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    //Navigate to home page if already logged in 
    useEffect(() => {
        if (user || company) {
            navigate("/");
        }
    });

    return (
        <>
            <Navbar />
            <Tabs defaultValue="job-seeker" className="mx-auto max-w-sm mt-10">
                <TabsList className="w-full">
                    <TabsTrigger value="job-seeker" className="w-1/2">
                        Job Seeker
                    </TabsTrigger>
                    <TabsTrigger value="company" className="w-1/2">
                        Company
                    </TabsTrigger>
                </TabsList>

                <div className="mx-auto max-w-sm border border-gray-200 rounded-md p-10 py-8 mt-5">
                    <h1 className="font-bold text-xl mb-5">Register</h1>

                    <TabsContent value="job-seeker">
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input
                                        id="first-name"
                                        name="firstName"
                                        placeholder="Max"
                                        value={jobSeekerData.firstName}
                                        onChange={handleJobSeekerChange}
                                        required
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input
                                        id="last-name"
                                        name="lastName"
                                        placeholder="Robinson"
                                        value={jobSeekerData.lastName}
                                        onChange={handleJobSeekerChange}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="max@example.com"
                                    value={jobSeekerData.email}
                                    onChange={handleJobSeekerChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="123-456-7890"
                                    value={jobSeekerData.phone}
                                    onChange={handleJobSeekerChange}
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

                            {loading ? (
                                <Loader2 className="w-full mt-2 animate-spin" />
                            ) : (
                                <Button type="submit" className="w-full" onClick={handleSubmitJobSeeker}>
                                    Create an account
                                </Button>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="company">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="companyName">Company name</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="ABC Corp"
                                    value={companyData.companyName}
                                    onChange={handleCompanyChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        name="industry"
                                        placeholder="Technology"
                                        value={companyData.industry}
                                        onChange={handleCompanyChange}
                                        required
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="New York"
                                        value={companyData.location}
                                        onChange={handleCompanyChange}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
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

                            {loading ? (
                                <Loader2 className="w-full mt-2 animate-spin" />
                            ) : (
                                <Button type="submit" className="w-full" onClick={handleSubmitCompany}>
                                    Create an account
                                </Button>
                            )}
                        </div>
                    </TabsContent>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </Tabs>
            <Footer />
        </>
    );
};

export default Register