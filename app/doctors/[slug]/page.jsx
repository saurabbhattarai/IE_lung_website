import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ChevronRight,
  GraduationCap,
  Award,
  Building2,
  Trophy,
  Globe,
  FileText,
  CheckCircle2,
  Phone,
  ArrowRight,
  MapPin,
  ExternalLink,
  Printer,
} from "lucide-react";
import {
  getDoctorBySlug,
  getAllDoctorSlugs,
} from "@/lib/constants/doctorsData";

/**
 * Pre-renders all 7 physician profile pages at build time.
 */
export function generateStaticParams() {
  return getAllDoctorSlugs().map((slug) => ({
    slug,
  }));
}

/**
 * Generates dynamic SEO metadata and canonical URLs for physician profile pages.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    return {
      title: "Physician Not Found | Inland Empire Lung & Sleep Institute",
    };
  }

  const title = `${doctor.fullName || doctor.name} | IE Lung & Sleep Institute`;
  const description = `${doctor.name} (${doctor.credentials}) is a ${doctor.title} at the Inland Empire Lung & Sleep Institute in Redlands, CA. Specialized in ${doctor.speciality}.`;
  const canonicalUrl = `https://ielung.com/doctors/${doctor.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Inland Empire Lung & Sleep Institute",
      locale: "en_US",
      type: "profile",
      images: [
        {
          url: doctor.image,
          width: 800,
          height: 1000,
          alt: doctor.name,
        },
      ],
    },
  };
}

function parsePublicationLinks(pubText) {
  const pmidMatch = pubText.match(/PMID:\s*(\d+)/i);
  const doiMatch = pubText.match(/doi:\s*([^\s;]+)/i);

  const pmid = pmidMatch ? pmidMatch[1] : null;
  const doi = doiMatch ? doiMatch[1].replace(/[.,]+$/, "") : null;

  return { pmid, doi };
}

export default async function DoctorProfilePage({ params }) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  const bioParagraphs = doctor.fullDescription
    ? doctor.fullDescription.split("\n\n").filter(Boolean)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.fullName || doctor.name,
    description: doctor.fullDescription
      ? `${doctor.fullDescription.slice(0, 250)}...`
      : undefined,
    image: `https://ielung.com${doctor.image}`,
    url: `https://ielung.com/doctors/${doctor.slug}`,
    medicalSpecialty: doctor.speciality,
    telephone: "+1-909-793-2404",
    ...(doctor.fax ? { faxNumber: doctor.fax } : {}),
    ...(doctor.languages ? { knowsLanguage: doctor.languages } : {}),
    worksFor: {
      "@type": "MedicalOrganization",
      name: "Inland Empire Lung & Sleep Institute",
      url: "https://ielung.com",
      telephone: "+1-909-793-2404",
      address: {
        "@type": "PostalAddress",
        streetAddress: "245 Terracina Boulevard, Suite 108",
        addressLocality: "Redlands",
        addressRegion: "CA",
        postalCode: "92373",
        addressCountry: "US",
      },
    },
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Physician JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <Navigation />

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-3.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs md:text-sm text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-accent transition">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400 shrink-0" />
          <Link href="/#providers" className="hover:text-accent transition">
            Our Providers
          </Link>
          <ChevronRight size={14} className="text-slate-400 shrink-0" />
          <span className="text-slate-900 font-medium truncate">
            {doctor.name}
          </span>
        </div>
      </div>

      {/* Profile Header Hero */}
      <header className="bg-white border-b border-slate-200/80 py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Headshot */}
          <div className="relative w-52 h-64 sm:w-60 sm:h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 shrink-0">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              priority
              sizes="(max-width: 768px) 240px, 280px"
              className="object-cover object-top"
            />
          </div>

          {/* Physician Identity & Quick Action Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {doctor.credentials && (
                <span className="bg-[#3D4749] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {doctor.credentials}
                </span>
              )}
              {doctor.trustBadges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">
              {doctor.fullName || doctor.name}
            </h1>

            <p className="text-lg md:text-xl font-medium text-accent leading-snug">
              {doctor.title}
            </p>

            <p className="text-slate-600 text-sm md:text-base">
              Specialty:{" "}
              <span className="text-primary font-semibold">
                {doctor.speciality}
              </span>
            </p>

            {doctor.fax && (
              <p className="text-xs md:text-sm text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1.5">
                <Printer size={15} className="text-slate-400" />
                Clinic Fax: {doctor.fax}
              </p>
            )}

            {/* Restrained CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link
                href="/#schedule"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                Request an Appointment
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:9097932404"
                className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-primary px-5 py-3 rounded-xl font-semibold text-sm transition"
              >
                <Phone size={16} className="text-accent" />
                (909) 793-2404
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="bg-slate-50/50 py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Main Left Column: Biography, Personal Life, Publications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-primary border-b border-slate-100 pb-4">
                Biography
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed text-base">
                {bioParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Personal Life (Rendered only when supplied) */}
            {doctor.personalLife && (
              <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold text-primary border-b border-slate-100 pb-4">
                  Personal Life & Interests
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                  {doctor.personalLife}
                </p>
              </section>
            )}

            {/* Publications & Research (Rendered only when supplied) */}
            {doctor.publications && doctor.publications.length > 0 && (
              <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-bold text-primary">
                    Research & Publications
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {doctor.publications.length} Citations
                  </span>
                </div>
                <div className="space-y-4">
                  {doctor.publications.map((pub, idx) => {
                    const { pmid, doi } = parsePublicationLinks(pub);
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2.5"
                      >
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono">
                          {pub}
                        </p>
                        {(pmid || doi) && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            {pmid && (
                              <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-accent font-semibold hover:underline"
                              >
                                PubMed: {pmid}
                                <ExternalLink size={12} />
                              </a>
                            )}
                            {doi && (
                              <a
                                href={`https://doi.org/${doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-slate-600 hover:text-accent font-medium hover:underline"
                              >
                                DOI: {doi}
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar Column: Credentials, Focus, Affiliations, Clinic Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clinical Focus */}
            {doctor.clinicalFocus && doctor.clinicalFocus.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  Clinical Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.clinicalFocus.map((focus, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/60"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Training */}
            {doctor.education && doctor.education.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  Education & Training
                </h3>
                <ul className="space-y-2.5">
                  {doctor.education.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5 leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Board Certifications */}
            {doctor.certifications && doctor.certifications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Board Certifications
                </h3>
                <ul className="space-y-2.5">
                  {doctor.certifications.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5 leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hospital & Academic Affiliations */}
            {doctor.affiliations && doctor.affiliations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  Affiliations
                </h3>
                <ul className="space-y-2.5">
                  {doctor.affiliations.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5 leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Leadership & Awards (Rendered only when supplied) */}
            {doctor.leadershipAndAwards && doctor.leadershipAndAwards.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Leadership & Honors
                </h3>
                <ul className="space-y-2.5">
                  {doctor.leadershipAndAwards.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5 leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages Spoken (Rendered only when supplied) */}
            {doctor.languages && doctor.languages.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Languages
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {doctor.languages.join(", ")}
                </p>
              </div>
            )}

            {/* Practice Location Card */}
            <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <h4 className="font-bold text-primary text-base">
                Inland Empire Lung & Sleep Institute
              </h4>
              <div className="flex items-start gap-2.5 text-slate-600">
                <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                <span>
                  245 Terracina Boulevard, Suite 108
                  <br />
                  Redlands, CA 92373
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone size={16} className="text-accent shrink-0" />
                <a
                  href="tel:9097932404"
                  className="hover:text-accent font-semibold"
                >
                  (909) 793-2404
                </a>
              </div>
              {doctor.fax && (
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Printer size={16} className="text-slate-400 shrink-0" />
                  <span>Fax: {doctor.fax}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restrained Bottom CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#3D4749] to-[#2D3537] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Consult with {doctor.name}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Our pulmonary and sleep specialists are here to provide comprehensive
            evaluations and compassionate care.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/#schedule"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3.5 rounded-xl font-semibold transition"
            >
              Schedule Appointment
              <ArrowRight size={16} />
            </Link>
            <a
              href="tel:9097932404"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold transition"
            >
              <Phone size={16} />
              (909) 793-2404
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
