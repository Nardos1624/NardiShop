"use client";

import Categories from "@/components/categories";
import FeaturedProducts from "@/components/featured-products";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import NewsLetter from "@/components/news-letter";
import PoweredBy from "@/components/powered-by";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <NewsLetter />
      <Footer />
      <PoweredBy />
    </>
  );
}

export default Home;