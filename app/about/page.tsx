import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
export default function AboutPage() {
  const pinkColor = "rgb(255, 182, 193)";
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#212121] text-[#E0E0E0] py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-5xl font-bold mb-8">
           <span style={{ color: pinkColor }}>NardiShop</span>
        </h1>

        {/* Story Section */}
        <section className="space-y-6 text-lg leading-relaxed opacity-90">
          <p>
            Founded in 2025, NardiShop began with a simple idea that high-quality 
            products should not be hard to find. We curated a collection that 
            blends modern aesthetics with everyday functionality.
          </p>
          <p>
            Every item in our shop is a reflection of our commitment to 
            <span className="font-bold"> excellence, durability, and style.</span>
          </p>
        </section>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 cursor-pointer">
          {[
            { title: "Premium Quality", desc: "Curated from the best sources." },
            { title: "Fast Delivery", desc: "Shipping that keeps up with you." },
            { title: "Secure Payments", desc: "Your data is always protected." }
          ].map((value, i) => (
            <div 
              key={i}
              className="p-6 rounded-xl border border-zinc-800 transition-all hover:-translate-y-1"
              style={{ borderLeft: `4px solid ${pinkColor}` }}
            >
              <h3 className="font-bold text-xl mb-2" style={{ color: pinkColor }}>{value.title}</h3>
              <p className="text-sm opacity-70">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}