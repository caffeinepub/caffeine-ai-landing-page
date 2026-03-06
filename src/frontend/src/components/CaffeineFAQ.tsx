import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "../hooks/useScrollReveal";

const faqs = [
  {
    ocid: "faq.item.1",
    question: "What is Caffeine?",
    answer:
      "Caffeine is the world's first platform where you can create and maintain full-stack applications simply by chatting with AI. You describe what you want to build in plain English, and Caffeine generates, deploys, and hosts a complete app for you — no coding required.",
  },
  {
    ocid: "faq.item.2",
    question: "Do I need to know how to code?",
    answer:
      "Absolutely not. Caffeine is designed for everyone — entrepreneurs, creators, business owners, and anyone with an idea. If you can describe what you want in plain language, Caffeine can build it. No programming knowledge is required at any point.",
  },
  {
    ocid: "faq.item.3",
    question: "What kinds of apps can I build?",
    answer:
      "The possibilities are nearly limitless. You can build SaaS dashboards, marketplaces, booking systems, portfolio sites, internal tools, community platforms, data pipelines, e-commerce stores, and much more. If you can describe it, Caffeine can build it.",
  },
  {
    ocid: "faq.item.4",
    question: "How does deployment work?",
    answer:
      "When you create an app with Caffeine, it automatically compiles and deploys your application to the Internet Computer (ICP) blockchain. Your app is live on a globally distributed, decentralized network — no server setup, no cloud configs, and no ongoing maintenance on your part.",
  },
  {
    ocid: "faq.item.5",
    question: "What is the Internet Computer?",
    answer:
      "The Internet Computer (ICP) is a next-generation blockchain built by DFINITY Foundation that allows smart contracts to run at web speed and scale. Unlike traditional blockchains, ICP can host full web applications — frontend, backend, and database — entirely on-chain, making it ideal for AI-built apps like those created with Caffeine.",
  },
  {
    ocid: "faq.item.6",
    question: "Who created Caffeine?",
    answer:
      "Caffeine was conceived by Dominic Williams, the founder and Chief Scientist of the DFINITY Foundation. Work on the platform began in June 2024. The Caffeine team is continuously improving the AI models and platform capabilities to make app creation more powerful and accessible.",
  },
];

export function CaffeineFAQ() {
  const ref = useScrollReveal();

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 relative overflow-hidden"
      ref={ref}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.82 0.20 196 / 0.04) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-cyan mb-4">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground leading-tight tracking-tight">
            Frequently asked
            <br />
            <span className="text-gradient-cyan">questions.</span>
          </h2>
        </div>

        <div className="reveal delay-100">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.ocid}
                value={faq.ocid}
                data-ocid={faq.ocid}
                className="glass-card rounded-2xl border-0 px-6 overflow-hidden"
              >
                <AccordionTrigger className="font-display font-semibold text-base text-foreground hover:text-cyan hover:no-underline py-5 text-left transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
