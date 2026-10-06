import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const insurancePlans = [
  {
    name: "Maren Medical Group",
    logo: "https://maren.com/wp-content/uploads/2025/05/marenlogo-horiz.svg",
  },
  {
    name: "Community Alliance Medical Group",
    logo: "https://images.squarespace-cdn.com/content/v1/65032e78554bee57bb3732a5/bbef6eba-7b65-42ae-aa65-70c2f5cd4fe4/CAMG-black-pinkribbon.png?format=1500w",
  },
  {
    name: "Medicare",
    logo: "https://frontend.medicare.gov/assets/medicare-logo-green-DrWAB2BY.svg",
  },
  {
    name: "Blue Cross",
    logo: "https://www.bcbs.com/dA/cec184ec-9008-4a98-bd75-b5d2304fb861/85q",
  },
  {
    name: "United Healthcare",
    logo: "https://1000logos.net/wp-content/uploads/2018/02/United-Healthcare-Logo.png",
  },
  {
    name: "Triwest Healthcare Alliance",
    logo: "https://www.spineandrehab.com/wp-content/uploads/2023/04/Untitled-design-2023-04-04T053407.087-1-e1680557736158.png.webp",
  },
  {
    name: "Aetna",
    logo: "https://www.aetna.com/content/dam/aetna/images/logos/Aetna_Logo_ss_Violet_RGB_Coated.svg",
  },
  {
    name: "WellCare",
    logo: "https://www.wellcare.com/-/media/logos-and-icons/wellcare-logos/wellcarelogo180.ashx",
  },
];

export default function Insurance() {
  return (
    <section id="insurance" className="bg-slate-50/50 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 space-y-4 text-center">
          <p className="mb-4 font-semibold uppercase tracking-widest text-accent">
            Insurance
          </p>
          <h2 className="mx-auto mb-5 max-w-3xl text-4xl font-bold text-primary md:text-5xl">
            Insurance Plans We Accept
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-primary/60">
            We work with a range of insurance plans to ensure you get the best care. Contact our team to confirm
            coverage and benefits for your specific plan.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {insurancePlans.map((plan) => (
            <li
              key={plan.name}
              className="flex min-h-28 items-center gap-4 rounded-2xl border border-primary/10 bg-white px-5 py-6 shadow-sm"
            >
              {/* <ShieldCheck
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-accent"
              /> */}
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                {plan.logo && (
                  <Image
                    src={plan.logo}
                    alt=""
                    width={180}
                    height={56}
                    className="h-10 w-auto max-w-full object-contain"
                  />
                )}
                <span className="font-semibold text-primary">{plan.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
