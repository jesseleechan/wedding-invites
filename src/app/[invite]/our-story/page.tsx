import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OurStory } from "@/components/OurStory";
import { getInvite, inviteList, isTrail } from "@/invites";

export function generateStaticParams() {
  return inviteList.filter((i) => i.story).map((i) => ({ invite: i.slug }));
}

export async function generateMetadata(props: PageProps<"/[invite]/our-story">): Promise<Metadata> {
  const { invite: slug } = await props.params;
  const invite = getInvite(slug);
  if (!invite || isTrail(invite) || !invite.story) return {};
  return { title: `${invite.story.hero.title} — ${invite.meta.title}`, description: invite.story.intro.body.replace(/\*/g, "") };
}

export default async function OurStoryPage(props: PageProps<"/[invite]/our-story">) {
  const { invite: slug } = await props.params;
  const invite = getInvite(slug);
  if (!invite || isTrail(invite) || !invite.story) notFound();
  return <OurStory invite={invite} story={invite.story} />;
}
