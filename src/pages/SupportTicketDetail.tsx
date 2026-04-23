import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Ticket = {
  id: string;
  email: string;
  subject: string;
  status: "open" | "closed";
  created_at: string;
  user_id: string;
};

type TicketMessage = {
  id: string;
  email: string;
  message: string;
  is_admin: boolean;
  created_at: string;
};

const ADMIN_EMAIL = "yurieforlife@gmail.com";

const SupportTicketDetail = () => {
  const { ticketId } = useParams();
  const { user, loading } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const fetchTicketData = async () => {
    if (!ticketId || !user) return;

    setLoadingData(true);

    const { data: ticketData, error: ticketError } = await supabase
      .from("support_tickets")
      .select("id, email, subject, status, created_at, user_id")
      .eq("id", ticketId)
      .single();

    if (ticketError) {
      setLoadingData(false);
      toast({
        title: "Failed to load ticket",
        description: ticketError.message,
        variant: "destructive",
      });
      return;
    }

    const typedTicket = ticketData as Ticket;

    if (!isAdmin && typedTicket.user_id !== user.id) {
      setLoadingData(false);
      toast({
        title: "Access denied",
        description: "You cannot view this ticket.",
        variant: "destructive",
      });
      return;
    }

    const { data: messageData, error: messageError } = await supabase
      .from("support_ticket_messages")
      .select("id, email, message, is_admin, created_at")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    setLoadingData(false);

    if (messageError) {
      toast({
        title: "Failed to load messages",
        description: messageError.message,
        variant: "destructive",
      });
      return;
    }

    setTicket(typedTicket);
    setMessages((messageData as TicketMessage[]) || []);
  };

  useEffect(() => {
    if (!loading && user && ticketId) {
      fetchTicketData();
    }
  }, [loading, user, ticketId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketId) return;

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please type a message first.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    const { data, error } = await supabase.rpc("send_support_ticket_message", {
      input_ticket_id: ticketId,
      input_message: message.trim(),
    });

    setSending(false);

    if (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (!data?.success) {
      toast({
        title: "Failed to send message",
        description: data?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    setMessage("");
    await fetchTicketData();
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1000px] px-4 py-12 md:px-6">
        <div className="mb-6">
          <Link
            to={isAdmin ? "/admin" : "/support"}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>
        </div>

        {!ticket ? (
          <div className="rounded-3xl border border-border bg-gradient-panel p-8 shadow-elegant">
            <p className="text-muted-foreground">Ticket not found.</p>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    {ticket.subject}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    From: {ticket.email}
                  </p>
                </div>

                <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {ticket.status}
                </span>
              </div>
            </div>

            <section className="mt-6 rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Conversation
              </h2>

              <div className="mt-6 space-y-4">
                {loadingData ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No messages yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-2xl border p-4 ${
                        msg.is_admin
                          ? "border-purple-500/30 bg-purple-500/10"
                          : "border-border bg-card/50"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-bold">
                          {msg.is_admin ? "Admin" : msg.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString()}
                        </div>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/85">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSend}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isAdmin ? "Reply as admin..." : "Type your message..."}
                  className="min-h-[140px] w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none"
                  disabled={sending}
                />

                <Button
                  type="submit"
                  disabled={sending}
                  className="h-12 rounded-2xl bg-gradient-cta px-6 text-primary-foreground shadow-glow"
                >
                  {sending ? "Sending..." : "Send message"}
                </Button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default SupportTicketDetail;
