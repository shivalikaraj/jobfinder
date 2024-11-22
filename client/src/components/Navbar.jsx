import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutCompany, logoutJobSeeker } from "@/api";
import { setUser } from "@/features/authSlice";
import { setCompany } from "@/features/companySlice";
import { BASE_URL } from "@/config";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { company } = useSelector((state) => state.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Handle logout
    const logoutHandler = async () => {
        try {
            if (user) {
                const response = await logoutJobSeeker();
                if (response.data.success) {
                    dispatch(setUser(null));
                    navigate("/");
                    toast.success(response.data.message);
                }
            } else if (company) {
                const response = await logoutCompany();
                if (response.data.success) {
                    dispatch(setCompany(null));
                    navigate("/");
                    toast.success(response.data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-24">
                <div>
                    <h1 className="text-3xl font-bold">
                        Job<span className="text-[#235191]">Finder</span>
                    </h1>
                </div>

                <div className="flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-5 text-lg">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/jobs">Jobs</Link>
                        </li>
                        <li>
                            <Link to="/browse">Browse</Link>
                        </li>
                    </ul>

                    {user || company ? (
                        <>
                            <Popover>
                                <PopoverTrigger>
                                    <Avatar>
                                        <AvatarImage
                                            src={`${BASE_URL}${user?.profile || company?.logo}`}
                                            alt="profile"
                                        />
                                        <AvatarFallback className="text-sm font-medium">
                                            {user
                                                ? `${user.firstName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}${user.lastName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}`
                                                : company
                                                    ? `${company.companyName?.charAt(0)?.toUpperCase()}`
                                                    : ""}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="flex gap-4 items-center">
                                        <Avatar>
                                            <AvatarImage
                                                src={`${BASE_URL}${user?.profile || company?.logo}`}
                                            />
                                            <AvatarFallback className="text-sm font-medium">
                                                {user
                                                    ? `${user.firstName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}${user.lastName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}`
                                                    : company
                                                        ? `${company.companyName?.charAt(0)?.toUpperCase()}`
                                                        : ""}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {user
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : company?.companyName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-gray-700 mt-2">
                                        <div className="flex items-center gap-2">
                                            <User2 className="" />
                                            <Link to={company ? "/company-profile" : "/profile"}>
                                                <Button variant="link">View Profile</Button>
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LogOut />
                                            <Button variant="link" onClick={logoutHandler}>
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="outline" className="border-[]">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-[#1f406a] hover:bg[#1B3658]">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar