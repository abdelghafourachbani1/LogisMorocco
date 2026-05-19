<x-public-layout>
    <!-- HERO SECTION -->
    <div class="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-white">
        <!-- Subtle background glow -->
        <div class="absolute inset-0 z-0 pointer-events-none">
            <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4"></div>
            <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-50 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
                
                <!-- Left Text Content -->
                <div class="max-w-2xl">
                    <!-- Badge -->
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-bold text-xs uppercase tracking-wider mb-8 animate-fade-in">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        NEW: OFFLINE LOCAL DISPATCHING
                    </div>
                    
                    <h1 class="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-gray-900 leading-[1.05] tracking-tight mb-6 animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
                        Revolutionizing <br class="hidden sm:block" />
                        <span class="text-brand-500">Moroccan Logistics</span> <br class="hidden sm:block" />
                        with Precision <br class="hidden sm:block" />
                        Tech.
                    </h1>
                    
                    <p class="text-lg md:text-xl text-gray-500 mb-10 max-w-xl leading-relaxed font-medium animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
                        Automate last-mile deliveries, track fleet efficiency in real-time, and scale your merchant network across the Kingdom with LogiMorocco's enterprise-grade engine.
                    </p>
                    
                    <div class="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm shadow-brand-500/20 transition-all hover:shadow-brand-500/40 hover:-translate-y-0.5 gap-2" wire:navigate>
                                Book a Demo
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </a>
                        @endif
                        <a href="#pricing" class="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-gray-900 rounded-lg hover:bg-black transition-all hover:-translate-y-0.5">
                            View Pricing
                        </a>
                    </div>

                    <!-- Trusted By -->
                    <div class="animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trusted By</p>
                        <div class="flex flex-wrap gap-8 items-center opacity-60 grayscale">
                            <span class="font-black text-xl italic tracking-tighter text-gray-900">MAROCSHIP</span>
                            <span class="font-black text-xl tracking-widest text-gray-900">ATLASLOG</span>
                            <span class="font-bold text-lg text-gray-900">CASALEXPRESS</span>
                        </div>
                    </div>
                </div>

                <!-- Right Visual: Truck Image with floating UI element -->
                <div class="relative w-full h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl animate-fade-in" style="animation-delay: 0.3s; animation-fill-mode: both;">
                    <img src="https://images.unsplash.com/photo-1586528116311-ad8ed7c83a00?q=80&w=2070&auto=format&fit=crop" alt="Logistics Truck in Warehouse" class="absolute inset-0 w-full h-full object-cover">
                    
                    <!-- Inner glow overlay -->
                    <div class="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                    
                    <!-- Floating UI Card overlay -->
                    <div class="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-between border border-white">
                        <div>
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Daily Deliveries</p>
                            <p class="text-3xl font-black text-gray-900 tracking-tight">1,248 Packages</p>
                        </div>
                        <div class="flex -space-x-4">
                            <div class="w-12 h-12 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center shrink-0 shadow-sm z-10"><span class="font-bold text-gray-500 text-sm">MB</span></div>
                            <div class="w-12 h-12 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center shrink-0 shadow-sm z-20"><span class="font-bold text-brand-600 text-sm">AY</span></div>
                            <div class="w-12 h-12 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center shrink-0 shadow-sm z-30"><span class="font-bold text-white text-sm">KS</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ARCHITECTURE SECTION (Bento Grid) -->
    <section class="py-24 bg-white relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <h2 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Powerful Logistics Architecture</h2>
                <p class="text-lg text-gray-500 font-medium">From real-time driver tracking to complex merchant reconciliation, we provide the tools to dominate the local market.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Smart Route Optimization (Dark, spans 2 cols) -->
                <div class="md:col-span-2 bg-gray-900 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group">
                    <div class="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                        <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <div>
                        <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                            <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-4">Smart Route Optimization</h3>
                        <p class="text-gray-400 font-medium max-w-md leading-relaxed mb-10">Our AI engine calculates the fastest routes through Casablanca, Marrakech, and Tangier traffic in real-time, saving 22% in fuel costs.</p>
                    </div>
                    <div class="mt-auto">
                        <div class="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-brand-500 w-[68%] rounded-full relative">
                                <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(219,0,135,0.8)]"></div>
                            </div>
                        </div>
                        <p class="text-xs font-bold text-brand-400 mt-3 tracking-widest uppercase">Efficiency Standard</p>
                    </div>
                </div>

                <!-- Inventory Sync (Light, spans 1 col) -->
                <div class="bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col group hover:bg-gray-100 transition-colors">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Inventory Sync</h3>
                    <p class="text-gray-500 font-medium leading-relaxed">Connect your warehouse directly to your fleet. Never miss a pickup with automated stock-level alerts.</p>
                </div>

                <!-- Driver Console (Light, spans 1 col) -->
                <div class="bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col group hover:bg-gray-100 transition-colors">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Driver Console</h3>
                    <p class="text-gray-500 font-medium leading-relaxed">A simplified mobile experience for couriers. POD, signature capture, and cash on delivery management.</p>
                </div>

                <!-- Merchant Growth Portal (Pink, spans 2 cols) -->
                <div class="md:col-span-2 bg-brand-500 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group">
                    <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl transform group-hover:scale-125 transition-transform duration-1000"></div>
                    <div class="relative z-10">
                        <h3 class="text-3xl font-black text-white tracking-tight mb-4">Merchant Growth Portal</h3>
                        <p class="text-white/90 font-medium max-w-lg leading-relaxed mb-8">Give your merchants a white-labeled dashboard to track their sales, shipping costs, and customer satisfaction metrics.</p>
                    </div>
                    <div class="relative z-10 mt-auto">
                        <a href="#" class="inline-flex items-center gap-2 text-white font-bold text-sm tracking-widest uppercase border-b-2 border-white pb-1 hover:text-brand-100 hover:border-brand-100 transition-colors">
                            Merchant Portal
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- HOW LOGIMOROCCO SCALES SECTION -->
    <section class="py-24 bg-white border-t border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div class="max-w-2xl">
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">How LogiMorocco Scales Your Operation</h2>
                    <p class="text-lg text-gray-500 font-medium">Three steps to a more efficient delivery ecosystem. Built for the modern Moroccan entrepreneur.</p>
                </div>
                <div class="flex gap-4">
                    <button class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button class="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black shadow-lg transition-all">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <!-- Step 1 -->
                <div class="relative group">
                    <div class="text-[120px] leading-none font-black text-gray-50 absolute -top-16 -left-6 -z-10 group-hover:-translate-y-4 transition-transform duration-500">01</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Integrate Merchants</h3>
                    <p class="text-gray-500 font-medium leading-relaxed">Onboard vendors in minutes via our API or bulk CSV upload. Set custom zones and pricing models for each partner.</p>
                </div>
                
                <!-- Step 2 -->
                <div class="relative group">
                    <div class="text-[120px] leading-none font-black text-gray-50 absolute -top-16 -left-6 -z-10 group-hover:-translate-y-4 transition-transform duration-500">02</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Automate Dispatch</h3>
                    <p class="text-gray-500 font-medium leading-relaxed">Orders are automatically assigned to the best available driver based on proximity, vehicle capacity, and load priority.</p>
                </div>
                
                <!-- Step 3 -->
                <div class="relative group">
                    <div class="text-[120px] leading-none font-black text-gray-50 absolute -top-16 -left-6 -z-10 group-hover:-translate-y-4 transition-transform duration-500">03</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Settle & Grow</h3>
                    <p class="text-gray-500 font-medium leading-relaxed">Automated billing and COD reconciliation. Use our analytics to identify your most profitable routes and expand.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- PRICING SECTION -->
    <section id="pricing" class="py-24 bg-[#111111] text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-20">
                <h2 class="text-3xl md:text-5xl font-black tracking-tight mb-4">Simple, Scalable Pricing</h2>
                <p class="text-lg text-gray-400 font-medium">No hidden fees. Scale as you ship.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
                <!-- Startup Plan -->
                <div class="bg-white rounded-3xl p-8 text-gray-900 shadow-xl relative">
                    <h3 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Startup</h3>
                    <div class="flex items-baseline gap-2 mb-8 border-b border-gray-100 pb-8">
                        <span class="text-5xl font-black tracking-tight">2,500</span>
                        <span class="text-sm font-bold text-gray-500">MAD / mo</span>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Up to 500 orders / mo
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            10 Driver App Licenses
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Standard Support
                        </li>
                    </ul>
                    <a href="#" class="block w-full py-4 text-center font-bold text-gray-900 border-2 border-gray-200 rounded-lg hover:border-gray-900 transition-colors">Start Trial</a>
                </div>

                <!-- Professional Plan -->
                <div class="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl relative border-4 border-brand-500 md:scale-105 z-10">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">Most Popular</div>
                    
                    <h3 class="text-sm font-black uppercase tracking-widest text-brand-500 mb-2">Professional</h3>
                    <div class="flex items-baseline gap-2 mb-8 border-b border-gray-100 pb-8">
                        <span class="text-5xl font-black tracking-tight">6,900</span>
                        <span class="text-sm font-bold text-gray-500">MAD / mo</span>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Unlimited orders
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            AI Route Optimization
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Multi-warehouse Support
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            24/7 Priority Support
                        </li>
                    </ul>
                    <a href="#" class="block w-full py-4 text-center font-bold text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-sm shadow-brand-500/20 transition-all hover:shadow-brand-500/40">Go Professional</a>
                </div>

                <!-- Enterprise Plan -->
                <div class="bg-white rounded-3xl p-8 text-gray-900 shadow-xl relative">
                    <h3 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Enterprise</h3>
                    <div class="flex items-baseline gap-2 mb-8 border-b border-gray-100 pb-8">
                        <span class="text-4xl font-black tracking-tight mt-2">Custom</span>
                    </div>
                    <p class="text-sm text-gray-500 font-medium mb-6">Tailored solutions for massive fleet networks and regional logistics providers.</p>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            White-label native apps
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Dedicated Account Manager
                        </li>
                        <li class="flex items-center gap-3 text-gray-600 font-medium">
                            <svg class="w-5 h-5 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Custom API Integration
                        </li>
                    </ul>
                    <a href="#" class="block w-full py-4 text-center font-bold text-white bg-gray-900 rounded-lg hover:bg-black transition-colors">Contact Sales</a>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA SECTION -->
    <section class="py-24 bg-white relative">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-brand-500 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-brand-500/20">
                <!-- Decorative background elements -->
                <div class="absolute inset-0 z-0">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div class="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div class="relative z-10">
                    <h2 class="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Ready to optimize your fleet?</h2>
                    <p class="text-xl text-white/90 font-medium mb-12 max-w-2xl mx-auto">Join 200+ Moroccan logistics companies already scaling with LogiMorocco. Get started today.</p>
                    
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#" class="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-brand-600 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform">
                            Request Free Trial
                        </a>
                        <a href="#" class="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-transparent border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                            Speak to an Expert
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</x-public-layout>
