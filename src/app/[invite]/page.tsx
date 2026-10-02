import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnvelopeScreen } from "@/components/EnvelopeScreen";
import { TrailEnvelope } from "@/concepts/trail";
import { getInvite, invites, isTrail } from "@/invites";

export function generateStaticParams() {
  return Object.keys(invites).map((invite) => ({ invite }));
}

export async function generateMetadata(props: PageProps<"/[invite]">): Promise<Metadata> {
  const { invite: slug } = await props.params;
  const invite = getInvite(slug);
  return invite ? { title: invite.meta.title, description: invite.meta.description } : {};
}

export default async function EnvelopePage(props: PageProps<"/[invite]">) {
  const { invite: slug } = await props.params;
  const invite = getInvite(slug);
  if (!invite) notFound();
  if (isTrail(invite)) return <TrailEnvelope invite={invite} />;
  return <EnvelopeScreen invite={invite} />;
}
