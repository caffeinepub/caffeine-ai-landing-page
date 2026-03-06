import { AlertCircle, CheckCircle, Mail, Send } from "lucide-react";
import { useState } from "react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const socialLinks = [
  {
    icon: SiGithub,
    label: "GitHub",
    href: "https://github.com/alexjohnson",
    color: "hover:text-foreground",
  },
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/alexjohnson",
    color: "hover:text-blue-500",
  },
  {
    icon: SiX,
    label: "Twitter / X",
    href: "https://twitter.com/alexjohnson",
    color: "hover:text-foreground",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:alex@example.com",
    color: "hover:text-teal",
  },
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 20)
    errors.message = "Message must be at least 20 characters";
  return errors;
}

export function Contact() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation({
    threshold: 0.1,
  });
  const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation({
    threshold: 0.1,
  });

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name as keyof FormErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitStatus("loading");
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitStatus("success");
    setForm({ name: "", email: "", message: "" });
    setTouched({});
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl bg-secondary/50 border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[field] && touched[field]
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:border-teal focus:ring-teal/20"
    }`;

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 scroll-hidden ${sectionVisible ? "scroll-visible" : ""}`}
        >
          <span className="text-teal text-sm font-semibold tracking-widest uppercase">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
            Let's Work Together
          </h2>
          <div className="mt-4 w-16 h-1 bg-teal mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Have a project in mind or just want to say hello? I'd love to hear
            from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info panel */}
          <div
            ref={infoRef}
            className={`lg:col-span-2 scroll-hidden-left ${infoVisible ? "scroll-visible" : ""}`}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Get in touch
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I'm currently open to freelance projects and full-time
                  opportunities. Whether you have a question or just want to
                  chat about tech, my inbox is always open.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href="mailto:alex@example.com"
                      className="text-sm font-medium text-foreground hover:text-teal transition-colors"
                    >
                      alex@example.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Find me on
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-11 h-11 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground ${color} hover:border-teal/40 hover:bg-teal/5 transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability card */}
              <div className="p-4 rounded-2xl border border-teal/30 bg-teal/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-foreground">
                    Available for work
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently accepting new projects. Typical response time:
                  within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div
            ref={formRef}
            className={`lg:col-span-3 scroll-hidden-right ${formVisible ? "scroll-visible" : ""}`}
          >
            {submitStatus === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-teal/30">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-teal" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Full Name <span className="text-teal">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Alex Johnson"
                      className={inputClass("name")}
                    />
                    {errors.name && touched.name && (
                      <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Email Address <span className="text-teal">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="alex@example.com"
                      className={inputClass("email")}
                    />
                    {errors.email && touched.email && (
                      <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Message <span className="text-teal">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell me about your project or just say hello..."
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && touched.message && (
                    <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-teal-glow hover:shadow-teal-glow-lg hover:scale-[1.02]"
                >
                  {submitStatus === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
