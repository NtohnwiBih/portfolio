import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/api/admin-api";
import { errorMessage } from "@/api/client";
import { isRead } from "@/api/admin-types";

export default function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: adminApi.messages.list,
  });
  const [openId, setOpenId] = useState<number | null>(null);

  const markRead = useMutation({
    mutationFn: (id: number) => adminApi.messages.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.messages.remove(id),
    onSuccess: () => {
      toast.success("Message deleted");
      qc.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const toggle = (id: number, read: boolean) => {
    setOpenId((cur) => (cur === id ? null : id));
    if (!read) markRead.mutate(id);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Inbox</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sent from the Contact page.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        {isLoading && <p className="p-8 text-center text-muted-foreground">Loading…</p>}
        {error && <p className="p-8 text-center text-destructive">{errorMessage(error)}</p>}
        {!isLoading && !error && messages.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">No messages yet.</p>
        )}
        {messages.map((m) => {
          const read = isRead(m);
          return (
            <div key={m.id} className="border-b border-border bg-card last:border-b-0">
              <button type="button" onClick={() => toggle(m.id, read)}
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary/30">
                {read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-accent" />}
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-foreground ${read ? "" : "font-semibold"}`}>{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
                <time className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</time>
              </button>
              {openId === m.id && (
                <div className="space-y-4 border-t border-border bg-background p-4">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{m.message}</p>
                  <div className="flex gap-2">
                    <Button asChild size="sm"><a href={`mailto:${m.email}`}>Reply</a></Button>
                    <Button size="sm" variant="outline" className="text-destructive"
                      onClick={() => confirm("Delete this message?") && remove.mutate(m.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}