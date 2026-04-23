import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifeBuoy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Support = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Ticket submitted", description: "We'll respond within 5 minutes on average." });
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-secondary shadow-glow">
            <LifeBuoy className="h-5 w-5 text-accent" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              <span className="text-gradient-brand">Support</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Open a ticket and our team will get back to you fast.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input id="name" placeholder="John Doe" className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" required />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Product</Label>
              <Select defaultValue="csgo-2">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csgo-2">CSGO 2</SelectItem>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="arc-raiders">Arc Raiders</SelectItem>
                  <SelectItem value="roblox">Roblox</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Brief summary of your issue" className="mt-1.5" required />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} placeholder="Describe the issue in detail..." className="mt-1.5" required />
          </div>

          <Button type="submit" size="lg" className="w-full bg-gradient-cta text-primary-foreground shadow-glow md:w-auto">
            {submitted ? "Submit another ticket" : "Submit ticket"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Support;
