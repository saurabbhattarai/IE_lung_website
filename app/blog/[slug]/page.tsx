import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TiptapRenderer from "@/components/blog/TiptapRenderer";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import {
  getPublicBlogPosts,
  getPublicBlogPostBySlug,
  getPublicBlogMetadata,
  formatPublicDate,
  formatReadingTime,
  buildFaqJsonLd,
} from "@/lib/blog/public";
import { getArticleDoctors } from "@/lib/blog/doctors";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders all currently published articles at build time.
 */
export async function generateStaticParams() {
  const { posts } = await getPublicBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generates dynamic SEO metadata and canonical URLs for individual blog articles.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPublicBlogMetadata(slug);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = formatPublicDate(post.publishedAt);
  const readTime = formatReadingTime(post.readingTimeMinutes);
  const coverImageSrc = post.coverImage?.trim() || "/logo.png";
  const doctors = post.showDoctorsSection
    ? getArticleDoctors(post.doctorSpecialtyOverrides)
    : [];
  const faqJsonLd = buildFaqJsonLd(post.faqs);

  return (
    <main className="bg-background text-foreground">
      {/* FAQ Schema Structured Data */}
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <Navigation />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#3D4749] via-[#2D3537] to-[#1D2527] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-24 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent truncate max-w-xs md:max-w-md">
              {post.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-sm mb-6">
            {formattedDate ? (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-3xl">
            {post.title}
          </h1>

          <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Blog Image */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
          <Image
            src={coverImageSrc}
            alt={post.title}
            width={300}
            height={180}
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Dynamic Tiptap Body Content */}
          <div className="prose-section mb-12">
            <TiptapRenderer content={post.content} />
          </div>

          {/* Meet the Physicians Section */}
          {post.showDoctorsSection && doctors.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
                Meet the IE Lung Physicians
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                  >
                    <p className="font-bold text-primary">{doc.name}</p>
                    <p className="text-primary/50 text-sm mt-1">{doc.specialty}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* FAQs Section */}
          {post.faqs && post.faqs.length > 0 ? (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                  >
                    <h3 className="font-bold text-primary mb-2">{faq.question}</h3>
                    <p className="text-primary/60 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>

      {/* Appointment CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#3D4749] to-[#2D3537]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book Your Appointment in Redlands
          </h2>
          <p className="text-white/70 mb-4 max-w-2xl mx-auto">
            You shouldn&apos;t have to live with poor breathing or poor sleep. Book
            a pulmonary or sleep consultation in Redlands. We look forward to
            welcoming you.
          </p>
          <div className="text-white/50 text-sm space-y-1 mb-8">
            <p className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              245 Terracina Boulevard, Suite 108, Redlands, CA 92373
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              909 938 1152 · Mon-Fri: 8AM - 5PM
            </p>
          </div>
          <Link
            href="/#schedule"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group"
          >
            Book Online
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Back to Blog Navigation */}
      <section className="py-8 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
