"use client";

import Categories from "@/components/categories";
import ContactCta from "@/components/contact-cta";
import FeaturedProducts from "@/components/featured-products";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import HomeBenefits from "@/components/home-benefits";
import HowItWorks from "@/components/how-it-works";
import Navbar from "@/components/navbar";
import PoweredBy from "@/components/powered-by";

function Home() {
  return (
    <>
      {/* Announcement bar */}
     
      <Navbar />
      <main>
        <HeroSection />
        <HomeBenefits />
        
        <Categories limit={8} viewAllHref="/categories" />
        <FeaturedProducts />
        <HowItWorks />
        <ContactCta />
      </main>
      
      <Footer />
      <PoweredBy />
    </>
  );
}

export default Home;
