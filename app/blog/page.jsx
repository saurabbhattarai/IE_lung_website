"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronRight, Calendar, Clock } from "lucide-react";

const blogPosts = [
  {
    slug: "ie-lung-opens-nov-2",
    title: "IE Lung Opens Nov 2 | Pulmonary Care in Redlands, CA",
    excerpt:
      "Inland Empire Lung & Sleep Institute opens November 2, 2026 in Redlands, CA. Seven specialists for asthma, COPD, sleep apnea and more. Book now.",
    date: "October 28, 2026",
    readTime: "5 min read",
    image: "/logo.png",
  },
];

export default function BlogListing() {
  return (
    <main className="bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-24 relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Blog</span>
          </div>
          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 text-sm">
              News & Insights
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              IE Lung Blog
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Health articles, clinic updates, and expert insights from the
              Inland Empire Lung & Sleep Institute.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center p-8">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={200}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-primary/50 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-primary/60 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

