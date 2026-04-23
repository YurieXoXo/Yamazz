import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  created_at: string;
};

const Support = () => {
  const { user, loading } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const fetchTickets = async () => {
    if (!user) {
      setTickets([]);
      setLoadingTickets(false);
      return;
    }

    setLoadingTickets(true);

    const { data, error } = await supabase
      .from("support_tickets")
      .select("id, subject, message, status, created_at")
      .order("created_at", { ascending: false });

    setLoadingTickets(false);

    if (error) {
      toast({
        title: "Failed to load tickets",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTickets((data as Ticket[]) || []);
  };

  useEffect(() => {
    if (!loading) {
      fetchTickets();
    }
  }, [loading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "You need to sign in",
        description: "Please log in before sending a support request.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in both subject and message.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    const { data, error } = await supabase.rpc("create_support_ticket", {
      input_subject: subject.trim(),
      input_message: message.trim(),
    });

    setSending(false);

    if (error) {
      toast({
        title: "Failed to create ticket",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (!data?.success) {
      toast({
        title: "Failed to create ticket",
        description: data?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket sent",
      description: "Your support request was submitted successfully.",
    });

    setSubject("");
    setMessage("");
    fetchTickets();
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1280px] px-4 py-12 md:px-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="text-gradient-brand">Support</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Need help? Open a ticket and chat with support.
          </p>
        </div>

        {!user && !loading ? (
          <div className="mt-8 rounded-3xl border border-border bg-gradient-panel p-8 shadow-elegant">
            <p className="text-muted-foreground">
              You need to be logged in to create a support ticket.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link to="/login">Go to login</Link>
              </Button>
            </div>
          </div>
        ) : null}

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Create ticket
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start a conversation with support.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="h-12 rounded-2xl"
                disabled={!user || sending}
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain your issue..."
                className="min-h-[180px] w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none"
                disabled={!user || sending}
              />

              <Button
                type="submit"
                disabled={!user || sending}
                className="h-12 w-full rounded-2xl bg-gradient-cta text-primary-foreground shadow-glow"
              >
                {sending ? "Sending..." : "Create ticket"}
              </Button>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Your tickets
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Open a ticket to view and continue the conversation.
            </p>

            <div className="mt-6 space-y-4">
              {loadingTickets ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Loading tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No tickets yet.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-border bg-card/50 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-bold">{ticket.subject}</h3>
                      <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {ticket.status}
                      </span>
                    </div>

                    <div className="mt-4 text-xs text-muted-foreground">
                      Created: {new Date(ticket.created_at).toLocaleString()}
                    </div>

                    <div className="mt-4">
                      <Button asChild variant="outline" className="rounded-2xl">
                        <Link to={`/support/${ticket.id}`}>Open ticket</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Support;
