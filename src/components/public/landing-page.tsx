import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { BarChart3, CheckCircle2, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

type FeatureCard = {
  title: string;
  description: string;
  imageUrl: string;
  icon: typeof Store;
};

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  isHighlighted?: boolean;
};

const featureCards: FeatureCard[] = [
  {
    title: "Easy Store Creation",
    description:
      "Create your online store in minutes with a simple and intuitive interface designed to reduce friction and boost speed.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFcX8ModkFrN3jg1x8nBlHHxWobvJm2ISyX-hAuvBPM2U9JiFT9awdPWOwZv3fEVetrpg2r4EBCFUlaZJHX8iZcxoo7nywmX5Gwck-HZylh5IsA44QSdG1fU-Jq_IAzz9N5pXCrD1E1v_FfojPI_0tVgrRQh6w5Vqz2UPfItKlymp7EidvKBD441Q71i2_jPwOKT1uGpD4hwT2uGzN73dJMysP8uyMYLop6buB05asyagSGJCc3xZGGsH87n7BNWrdO6ek5N5EG-Bh",
    icon: Store,
  },
  {
    title: "Product Management",
    description:
      "Add, edit, and organize your products with ease. Manage variations, pricing, and SEO settings from a single command center.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA_ouBJA6Z5EUbmB-PjOowSgGL4DPdBfFljC8ls-IMT1sVDXLuGKrA90JNg2cE2GEX_jqxI1eGFPy1enIRyTzh7ON9xg7as2R5bM-OiGuPXcZ07fthezIukpQeCcg8Umvwm-XvktDdyBaxkSVQ76qcs_CeiXcFxRgnL66Tp_S_RtV8fymH2uxCtvBJZ-67sW4320MjY7ed5NbErbSqo5iCkP7YffJn8qVOiPpnxB0BxeCt_jPXu-5UGd51t4myMuA6xODKAlowA30h",
    icon: Package,
  },
  {
    title: "Order Tracking",
    description:
      "Track orders and manage your sales in real time. Advanced analytics provide insights into customer behavior and revenue trends.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPVT2Wbqkqm8AemICINJ5SlI6ENFC2FFBZRFEqoAagNdHoQeoTvL7LQ8mNIZv7JF9bwpudxv-Qr237MqLJeFGGog8YoL_jvw4afTJ1nYxblRRwax1Un-guTnb1W1yYZTPXF2fAjCDRysAigmWSCsIPxrYUAcnvZyfBmhReplrE40JU6OLAD1b2ASwQ09hba6-_C-fCd1_h8nrvNXT5Jh3E6hJ328vMzyztbYqpynvncA2Q_4vVtmHkjlVCsSHZ1hzQ3ldbPA4uQ3ez",
    icon: BarChart3,
  },
];

const plans: Plan[] = [
  {
    name: "FREE",
    price: "$0",
    period: "/month",
    features: ["1 store", "Up to 10 products", "Basic dashboard", "Basic checkout (PIX)"],
    cta: "Start Free",
  },
  {
    name: "PRO",
    price: "$19",
    period: "/month",
    features: ["1 store", "Unlimited products", "Advanced dashboard", "Order management", "Custom branding"],
    cta: "Upgrade to Pro",
    isHighlighted: true,
  },
  {
    name: "MAX",
    price: "$49",
    period: "/month",
    features: ["Multiple stores", "Advanced analytics", "Priority processing", "Custom domain (future)"],
    cta: "Go Max",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Next Gen
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#pricing" className="text-sm font-semibold text-indigo-600">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <Button variant="ghost" className="h-9 px-4 text-sm font-medium text-slate-600">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <Button className="h-9 bg-indigo-600 px-4 text-sm font-semibold hover:bg-indigo-700">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-16 px-6 pb-20 pt-28 lg:grid-cols-2">
        <div className="space-y-8">
          <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
            New Feature Out Now
          </span>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
            Build your online store in <span className="text-indigo-600">minutes</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-600">
            Next Gen is the easiest way to create, manage, and grow your online business.
            Focus on your craft while we handle the complexity of commerce.
          </p>
          <div className="flex flex-wrap gap-3">
            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <Button className="h-12 bg-indigo-600 px-8 text-base font-bold hover:bg-indigo-700">
                Create Store
              </Button>
            </SignUpButton>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-200" />
              <span className="h-3 w-3 rounded-full bg-amber-200" />
              <span className="h-3 w-3 rounded-full bg-indigo-200" />
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Merchant Dashboard
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="Revenue" value="$42,920" change="+12.5%" />
            <MetricCard label="Orders" value="854" change="+8.2%" />
            <MetricCard label="Visitors" value="12.1k" change="Stable" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Everything you need to run your store
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Powering the next generation of online commerce with high-performance tools designed
            for modern merchants.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)] transition hover:-translate-y-1"
              >
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-7 text-slate-600">{feature.description}</p>
                <div className="relative mt-6 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-85 transition group-hover:opacity-100"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-20">
        <header className="mb-16 text-center">
          <h2 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Simple pricing for your business
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
            Start for free and upgrade as you grow. Our modular plans scale with your ambition,
            from solo merchants to global enterprises.
          </p>
        </header>
        <div className="grid items-stretch gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-xl p-8 transition hover:-translate-y-1 ${
                plan.isHighlighted
                  ? "z-10 scale-100 border-0 bg-white shadow-[0_12px_32px_-4px_rgba(70,72,212,0.12)] ring-2 ring-indigo-600 md:scale-105"
                  : "bg-slate-100"
              }`}
            >
              {plan.isHighlighted ? (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                  Most Popular
                </span>
              ) : null}
              <div className="mb-8">
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${
                    plan.isHighlighted ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-lg text-slate-500">{plan.period}</span>
                </div>
              </div>
              <ul className="mb-10 flex-grow space-y-4">
                {plan.features.map((item) => (
                  <li key={item} className="flex items-center text-sm text-slate-700">
                    <CheckCircle2 className="mr-3 h-4 w-4 text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full rounded-lg px-6 py-4 text-sm font-semibold transition active:scale-[0.98] ${
                  plan.isHighlighted
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-500 text-white hover:opacity-90"
                    : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
        <section className="mt-24 rounded-xl bg-slate-100 p-12 text-center">
          <h3 className="mb-12 text-sm font-bold uppercase tracking-widest text-slate-600">
            Trusted by global merchants
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
            <span className="text-2xl font-black tracking-tight">METRIC</span>
            <span className="text-2xl font-black tracking-tight">FLOW</span>
            <span className="text-2xl font-black tracking-tight">ELEMENT</span>
            <span className="text-2xl font-black tracking-tight">STRUCTURE</span>
            <span className="text-2xl font-black tracking-tight">NEXUS</span>
          </div>
        </section>
      </section>

      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-500 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-semibold tracking-tight text-slate-700">Next Gen</p>
            <p className="mt-1 text-xs">Modern commerce platform for growing stores.</p>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a href="#features" className="transition-colors hover:text-slate-700">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-slate-700">
              Pricing
            </a>
            <span>support@nextgen.app</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  change: string;
};

function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <article className="rounded-lg bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] font-bold text-indigo-600">{change}</p>
    </article>
  );
}
