import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import SearchForm from "@/components/SearchForm";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import PopularDestinations from "@/components/home/PopularDestinations";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <div className="relative z-20 px-4 -mt-16 sm:-mt-20">
        <SearchForm />
      </div>

      <FeaturedHotels />
      <PopularDestinations />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
