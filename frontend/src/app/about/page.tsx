"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-white">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
            Our Mission
          </div>
          
          <h1 className="text-5xl md:text-[54px] font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
            Driven by <span className="text-brand-500">velocity</span>.<br />
            Grounded in <span className="text-brand-500">reliability</span>.
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
            <div className="lg:col-span-7">
              <p className="text-lg text-gray-500 font-medium leading-relaxed mb-6">
                LogiMorocco was founded in Casablanca with a single, clear objective: to modernize the logistics infrastructure of the Kingdom of Morocco. By combining advanced software with a dedicated shipping network, we bridge the gap between merchants and consumers in every region.
              </p>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                Whether routing deliveries through busy downtown streets or bridging connections to remote provinces, we empower local businesses to deliver happiness, one package at a time.
              </p>
            </div>
            
            {/* Stats Column */}
            <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-8 border border-gray-100 grid grid-cols-2 gap-8 shadow-sm">
              <div>
                <h3 className="text-4xl font-black text-gray-900 mb-1">30+</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cities Covered</p>
              </div>
              <div>
                <h3 className="text-4xl font-black text-gray-900 mb-1">99.8%</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">On-Time Rate</p>
              </div>
              <div className="col-span-2 border-t border-gray-200/60 pt-6">
                <h3 className="text-4xl font-black text-gray-900 mb-1">1.2M+</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Packages Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Values Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">The Values That Keep Us Moving</h2>
            <p className="text-lg text-gray-500 font-medium">We design tools that facilitate operations and spark long-term growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 text-brand-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Transparency</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Zero uncertainty. Merchants and buyers see exactly where their cargo resides from pickup to signature.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 text-brand-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regional Connectivity</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                No province is left isolated. Our route optimization extends to standard shipping corridors and local dirt roads alike.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 text-brand-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Entrepreneur Empowerment</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Logistics is the backbone of commerce. By optimizing the delivery process, we help thousands of local shops thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Leadership Driving Progress</h2>
            <p className="text-lg text-gray-500 font-medium">Meet the engineers and logisticians transforming local shipping.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CEO */}
            <div className="group">
              <div className="aspect-[4/5] rounded-3xl bg-gray-100 overflow-hidden relative shadow-sm mb-6">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
                  alt="Sofia Bennani"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Sofia Bennani</h4>
              <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mt-1">Chief Executive Officer</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Sofia is dedicated to mapping out expansion paths across North Africa.</p>
            </div>

            {/* CTO */}
            <div className="group">
              <div className="aspect-[4/5] rounded-3xl bg-gray-100 overflow-hidden relative shadow-sm mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
                  alt="Karim El-Fassi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Karim El-Fassi</h4>
              <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mt-1">Chief Technology Officer</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Karim drives routing algorithm updates and serverless dispatch systems.</p>
            </div>

            {/* COO */}
            <div className="group">
              <div className="aspect-[4/5] rounded-3xl bg-gray-100 overflow-hidden relative shadow-sm mb-6">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop"
                  alt="Yassine Mansouri"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Yassine Mansouri</h4>
              <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mt-1">Head of Operations</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Yassine handles partner driver relations and warehouse setup details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Shape the future of Moroccan logistics.</h2>
              <p className="text-lg text-gray-400 font-medium mb-12 max-w-2xl mx-auto">We are always looking for visionary builders, software engineers, and transport professionals.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-gray-900 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                  Contact HR
                </Link>
                <Link href="/" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-transparent border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                  Back to Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
