import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LatestJobs from "@/components/LatestJobs";
import Navbar from "@/components/Navbar";
import useGetAllJobs from "@/hooks/useGetAllJobs"

const Home = () => {
  useGetAllJobs();
  return (
    <>
      <Navbar />
      <HeroSection />
      <LatestJobs />
      <Footer />
    </>
  )
}

export default Home