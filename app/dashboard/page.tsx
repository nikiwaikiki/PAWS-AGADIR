"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  PawPrint, Shield, AlertTriangle, Clock, CheckCircle, XCircle,
  Edit, Trash2, Eye, MessageSquare, Send, Users, Heart, ArrowLeft,
} from "lucide-react";

/* ---------- types ---------- */
type Dog = {
  id: string; name: string; ear_tag: string; photo_url: string | null;
  report_type: string; location: string | null; is_approved: boolean | null;
  is_vaccinated: boolean | null; urgency_level: string | null;
  created_at: string; latitude: number; longitude: number;
  additional_info: string | null; reported_by: string | null;
  vaccination1_date: string | null; vaccination2_date: string | null;
  vaccination_passport: string | null;
};
type HelperApp = { id: string; user_id: string; message: string; status: string; created_at: string };
type TeamMsg = { id: string; user_id: string; content: string; created_at: string; parent_id: string | null };

/* ---------- component ---------- */
export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, isAdmin, isHelper, isLoading: authLoading } = useAuth();

  const [tab, setTab] = useState<"pending" | "sos" | "all" | "messages" | "helpers">("pending");
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [apps, setApps] = useState<HelperApp[]>([]);
  const [msgs, setMsgs] = useState<TeamMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [editDog, setEditDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);

  /* fetch data */
  const fetchAll = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [d, a, m] = await Promise.all([
      supabase.from("dogs").select("*").order("created_at", { ascending: false }),
      supabase.from("helper_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("team_messages").select("*").order("created_at", { ascending: true }),
    ]);
    if (d.data) setDogs(d.data as Dog[]);
    if (a.data) setApps(a.data as HelperApp[]);
    if (m.data) setMsgs(m.data as TeamMsg[]);
    setLoading(false);
  }, []);

  useEffect(() => { if (isHelper) fetchAll(); }, [isHelper, fetchAll]);

  /* actions */
  const approveDog = async (id: string) => {
    if (!supabase) return;
    await supabase.from("dogs").update({ is_approved: true }).eq("id", id);
    fetchAll();
  };
  const deleteDog = async (id: string) => {
    if (!supabase || !confirm(t("admin.deleteConfirm"))) return;
    await supabase.from("dogs").delete().eq("id", id);
    fetchAll();
  };
  const updateDogField = async (id: string, field: Partial<Dog>) => {
    if (!supabase) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from("dogs").update(field as any).eq("id", id);
    setEditDog(null);
    fetchAll();
  };
  const handleHelperApp = async (id: string, status: "approved" | "rejected", userId: string) => {
    if (!supabase) return;
    await supabase.from("helper_applications").update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (status === "approved") {
      await supabase.from("user_roles").upsert({ user_id: userId, role: "moderator" });
    }
    fetchAll();
  };
  const sendMessage = async () => {
    if (!supabase || !user || !newMsg.trim()) return;
    await supabase.from("team_messages").insert({ user_id: user.id, content: newMsg.trim() });
    setNewMsg("");
    fetchAll();
  };
  const deleteMessage = async (id: string) => {
    if (!supabase) return;
    await supabase.from("team_messages").delete().eq("id", id);
    fetchAll();
  };

  /* computed */
  const pending = dogs.filter((d) => !d.is_approved && d.report_type !== "sos");
  const sos = dogs.filter((d) => d.report_type === "sos");
  const pendingApps = apps.filter((a) => a.status === "pending");

  /* guard */
  if (authLoading) return <div className="flex min-h-screen items-center justify-center font-sans text-muted-foreground">{t("common.loading")}</div>;

  if (!isHelper) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <Shield className="h-16 w-16 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold">{t("admin.accessDenied")}</h1>
          <p className="text-muted-foreground">{t("admin.accessDeniedDesc")}</p>
          <Link href="/" className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{t("admin.goHome")}</Link>
        </main>
      </div>
    );
  }

  const TABS = [
    { key: "pending" as const, label: t("admin.tabs.pending"), count: pending.length },
    { key: "sos" as const, label: t("admin.tabs.sos"), count: sos.length },
    { key: "all" as const, label: t("admin.tabs.all"), count: dogs.length },
    { key: "messages" as const, label: t("admin.tabs.messages"), count: msgs.length },
    ...(isAdmin ? [{ key: "helpers" as const, label: t("admin.tabs.helpers"), count: pendingApps.length }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-6">
          {/* title */}
          <div className="mb-6 flex items-center gap-3">
            <Link href="/" className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"><ArrowLeft className="h-5 w-5" /></Link>
            <div>
              <h1 className="font-display text-2xl font-bold">{isAdmin ? t("admin.title") : t("admin.helperTitle")}</h1>
              <p className="text-xs text-muted-foreground">{dogs.length} dogs &middot; {sos.length} SOS &middot; {pending.length} pending</p>
            </div>
          </div>

          {/* stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t("admin.stats.sos"), count: sos.length, icon: AlertTriangle, color: "text-warning" },
              { label: t("admin.stats.pending"), count: pending.length, icon: Clock, color: "text-amber-500" },
              { label: t("admin.stats.visible"), count: dogs.filter((d) => d.is_approved).length, icon: Eye, color: "text-safe" },
              { label: t("admin.stats.applications"), count: pendingApps.length, icon: Users, color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-xl font-bold text-foreground">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
            {TABS.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === tb.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {tb.label}
                {tb.count > 0 && <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">{tb.count}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted-foreground">{t("common.loading")}</p>
          ) : (
            <>
              {/* PENDING TAB */}
              {tab === "pending" && (
                <DogTable
                  dogs={pending}
                  t={t}
                  onApprove={approveDog}
                  onDelete={isAdmin ? deleteDog : undefined}
                  onEdit={setEditDog}
                />
              )}

              {/* SOS TAB */}
              {tab === "sos" && (
                <DogTable
                  dogs={sos}
                  t={t}
                  onApprove={approveDog}
                  onDelete={isAdmin ? deleteDog : undefined}
                  onEdit={setEditDog}
                />
              )}

              {/* ALL TAB */}
              {tab === "all" && (
                <DogTable
                  dogs={dogs}
                  t={t}
                  onApprove={approveDog}
                  onDelete={isAdmin ? deleteDog : undefined}
                  onEdit={setEditDog}
                />
              )}

              {/* MESSAGES TAB */}
              {tab === "messages" && (
                <div className="rounded-xl border border-border bg-card">
                  <div className="max-h-[60vh] overflow-y-auto p-4">
                    {msgs.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">No messages yet.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {msgs.map((m) => (
                          <div key={m.id} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm text-foreground">{m.content}</p>
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                {new Date(m.created_at).toLocaleString()}
                              </p>
                            </div>
                            {(isAdmin || m.user_id === user?.id) && (
                              <button onClick={() => deleteMessage(m.id)} className="text-muted-foreground hover:text-warning">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 border-t border-border p-3">
                    <input
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={t("admin.messages.replyPlaceholder")}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={sendMessage} className="rounded-lg bg-primary p-2 text-primary-foreground"><Send className="h-4 w-4" /></button>
                  </div>
                </div>
              )}

              {/* HELPERS TAB */}
              {tab === "helpers" && isAdmin && (
                <div className="space-y-3">
                  {pendingApps.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.noApplications")}</p>
                  ) : (
                    pendingApps.map((a) => (
                      <div key={a.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                        <Users className="mt-0.5 h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{a.message}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">{t("admin.appliedOn")} {new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleHelperApp(a.id, "approved", a.user_id)} className="rounded-md bg-safe p-1.5 text-white"><CheckCircle className="h-4 w-4" /></button>
                          <button onClick={() => handleHelperApp(a.id, "rejected", a.user_id)} className="rounded-md bg-warning p-1.5 text-white"><XCircle className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* EDIT DIALOG */}
          {editDog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4" onClick={() => setEditDog(null)}>
              <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="mb-4 font-display text-lg font-bold">{t("admin.editDialog")} - {editDog.name}</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked={editDog.is_vaccinated ?? false} onChange={(e) => updateDogField(editDog.id, { is_vaccinated: e.target.checked } as Partial<Dog>)} className="rounded" />
                    {t("admin.edit.markVaccinated")}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked={editDog.is_approved ?? false} onChange={(e) => updateDogField(editDog.id, { is_approved: e.target.checked } as Partial<Dog>)} className="rounded" />
                    {t("admin.edit.visibleToUsers")}
                  </label>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setEditDog(null)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm">{t("common.cancel")}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ---------- sub-component: dog table ---------- */
function DogTable({
  dogs, t, onApprove, onDelete, onEdit,
}: {
  dogs: Dog[];
  t: (k: string) => string;
  onApprove: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit: (d: Dog) => void;
}) {
  if (dogs.length === 0) return <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.noDogs")}</p>;

  return (
    <div className="space-y-3">
      {dogs.map((d) => (
        <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          {d.photo_url ? (
            <Image src={d.photo_url} alt={d.name} width={48} height={48} className="h-12 w-12 shrink-0 rounded-lg object-cover" unoptimized />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted"><PawPrint className="h-5 w-5 text-muted-foreground" /></div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                d.report_type === "sos" ? "bg-warning/10 text-warning" :
                d.report_type === "save" ? "bg-safe/10 text-safe" : "bg-muted text-muted-foreground"
              }`}>{d.report_type}</span>
              {d.is_approved ? (
                <span className="inline-flex rounded-full bg-safe/10 px-2 py-0.5 text-[10px] text-safe">{t("admin.status.visible")}</span>
              ) : (
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">{t("admin.status.pending")}</span>
              )}
              {d.location && <span className="text-[10px] text-muted-foreground">{d.location}</span>}
            </div>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {!d.is_approved && (
              <button onClick={() => onApprove(d.id)} title={t("admin.approve")} className="rounded-md bg-safe/10 p-1.5 text-safe hover:bg-safe/20">
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => onEdit(d)} title={t("admin.editDialog")} className="rounded-md bg-muted p-1.5 text-muted-foreground hover:bg-accent">
              <Edit className="h-4 w-4" />
            </button>
            {onDelete && (
              <button onClick={() => onDelete(d.id)} title="Delete" className="rounded-md bg-warning/10 p-1.5 text-warning hover:bg-warning/20">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
