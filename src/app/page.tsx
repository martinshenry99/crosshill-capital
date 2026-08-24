import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight,
  Globe,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-dark tracking-wide">
                CROSSHILL CAPITAL
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted hover:text-primary transition-colors">
                How It Works
              </a>
              <a
                href="https://www.indexmasterclass.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
              >
                Index Masterclass
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="accent" size="sm">
                  Start Investing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-white/90 text-sm">
                From the creators of Index Masterclass
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Institutional-Grade{" "}
              <span className="text-accent">Crypto Investment</span>{" "}
              for Everyone
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Access professionally managed crypto portfolios backed by the same
              expertise trusted by thousands of European investors through Index
              Masterclass.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button variant="accent" size="xl">
                  Create Your Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  Learn More
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-8 mt-12">
              <div>
                <p className="text-2xl font-bold text-white">$40M+</p>
                <p className="text-white/60 text-sm">Assets Managed</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-white">9,000+</p>
                <p className="text-white/60 text-sm">Active Investors</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-accent">24/7</p>
                <p className="text-white/60 text-sm">Portfolio Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Crosshill Capital
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Built on years of investment expertise from Index Masterclass,
              now bringing professional portfolio management to crypto.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Transparent",
                description:
                  "Your investments are managed with institutional-grade security. Full transparency on allocations and returns.",
              },
              {
                icon: BarChart3,
                title: "Professional Management",
                description:
                  "Portfolios managed by experienced professionals with Wall Street background and proven track record.",
              },
              {
                icon: BarChart3,
                title: "Crypto-First Strategy",
                description:
                  "Focused on BTC, ETH, and stablecoins with strategic allocation. ETFs and indices coming soon.",
              },
              {
                icon: TrendingUp,
                title: "Performance Tracking",
                description:
                  "Real-time portfolio dashboard with detailed performance charts, transaction history, and notifications.",
              },
              {
                icon: Users,
                title: "Community Backed",
                description:
                  "Join a community of 9,000+ investors who trust CROSSHILL CAPITAL with their crypto portfolio management.",
              },
              {
                icon: Globe,
                title: "European Focused",
                description:
                  "Designed for European investors, expats, and digital nomads. Compliant and accessible.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-border bg-white hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-primary-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up with your name, email, and country. Quick and simple registration.",
              },
              {
                step: "02",
                title: "Deposit Crypto",
                description:
                  "Send BTC, ETH, or USDT to your designated wallet address. We handle the rest.",
              },
              {
                step: "03",
                title: "Watch It Grow",
                description:
                  "Track your portfolio performance in real-time through your personal dashboard.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary-dark font-bold text-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Over 9,000+ Members Across Europe!
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Hear directly from our members about their investment experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "I'm kicking myself for not having this 15 years ago",
                name: "Izabela Lusinska",
                role: "Executive Coach, New Global Elite",
              },
              {
                quote: "My ultimate goal is to retire early",
                name: "Tom",
                role: "Audiologist",
              },
              {
                quote: "This is the best program out there",
                name: "Mikelis",
                role: "Graphic Designer",
              },
              {
                quote: "I realised how much I was overpaying investment advisors",
                name: "Harold",
                role: "Retired",
              },
              {
                quote: "Join as quickly as you can because you will save lots of time, resources and money",
                name: "Indre",
                role: "Expat",
              },
              {
                quote: "I wish I knew this 15 years ago",
                name: "Mario Zorz",
                role: "Software Engineering Manager",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-border bg-white hover:shadow-lg transition-shadow"
              >
                <Quote className="w-8 h-8 text-accent mb-4" />
                <p className="text-foreground font-medium mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://www.indexmasterclass.com/testimonials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              See all testimonials &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-dark to-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Investing?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join thousands of investors already growing their wealth with CROSSHILL CAPITAL.
          </p>
          <Link href="/signup">
            <Button variant="accent" size="xl">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-wide">
                  CROSSHILL CAPITAL
                </span>
              </div>
              <p className="text-white/60 text-sm">
                Institutional-grade crypto investment management for individual investors.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link href="/signup" className="text-white/60 hover:text-white text-sm">
                  Create Account
                </Link>
                <Link href="/login" className="text-white/60 hover:text-white text-sm">
                  Log In
                </Link>
                <Link href="/dashboard" className="text-white/60 hover:text-white text-sm">
                  Dashboard
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Ecosystem</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.indexmasterclass.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm"
                >
                  Index Masterclass
                </a>
                <a
                  href="https://www.indexmasterclass.com/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm"
                >
                  About Us
                </a>
                <a
                  href="https://www.indexmasterclass.com/testimonials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm"
                >
                  Testimonials
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="flex flex-col gap-2">
                <Link href="/terms" className="text-white/60 hover:text-white text-sm">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-white/60 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} CROSSHILL CAPITAL. All rights reserved.
            </p>
            <p className="text-white/40 text-xs mt-2 md:mt-0 max-w-lg text-center md:text-right">
              Investing involves risk. Past performance does not guarantee future results.
              All investment decisions remain your own responsibility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
