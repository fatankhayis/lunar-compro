import Header from "../components/Header";
import HomePage from "./About/Components/HomePage";
import AboutPage from "./About/Components/AboutPage";
import BlogSection from "./About/Components/BlogSection";
import TeamPage from "./About/Components/TeamPage";
import Footer from "../components/Footer";


const About = () => {
  return (
      <div className="min-h-screen">
        <Header />
        <HomePage />
        <AboutPage />
        <BlogSection />
        <TeamPage />
        <Footer />
      </div>
  );
};

export default About;
