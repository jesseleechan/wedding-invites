import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/Invitation";
import { TrailInvitation } from "@/concepts/trail";
import { getInvite, invites, isTrail } from "@/invites";

export function generateStaticParams() {
  return Object.keys(invites).map((invite) => ({ invite }));
}

export async function generateMetadata(props: PageProps<"/[invite]/home">): Promise<Metadata> {
  const { invite: slug } = await props.params;
  const invite = getInvite(slug);
  return invite ? { title: invite.meta.title, description: invite.meta.description } : {};
}

export default async function HomePage(props: PageProps<"/[invite]/home">) {
  const { invite: slug } = await props.params;
  const invite = getInvite(slug);
  if (!invite) notFound();
  if (isTrail(invite)) return <TrailInvitation invite={invite} />;
  return <Invitation invite={invite} />;
}
