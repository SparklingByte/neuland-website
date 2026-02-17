import { getTranslations } from 'next-intl/server'
import AboutUsSection from '@/components/AboutUs/about-us-section'
import BlogPreview from '@/components/blog/blog-peview'
import ClientIntro from '@/components/client-intro'
import EventsSection from '@/components/Events/events-section'
import TerminalSection from '@/components/Layout/terminal-section'
import NextAppShowcase from '@/components/next-app-showcase'
import ProjectsShowcase from '@/components/Projects/projects-showcase'
import TerminalMembership from '@/components/terminal-membership'
import TerminalPartners from '@/components/terminal-partners'

export default async function Index() {
	const t = await getTranslations('Home')

	return (
		<>
			<ClientIntro />
			<EventsSection />
			<NextAppShowcase />
			<TerminalSection title={t('projectsSection.title')} headingLevel={2}>
				<ProjectsShowcase />
			</TerminalSection>
			<AboutUsSection />
			<TerminalSection
				title={t('membershipSection.title')}
				headingLevel={2}
				id="membership"
			>
				<TerminalMembership />
			</TerminalSection>
			<TerminalSection title={t('partnerSection.title')} headingLevel={2}>
				<TerminalPartners />
			</TerminalSection>
			<TerminalSection title="Neuland Blog" headingLevel={2}>
				<BlogPreview />
			</TerminalSection>
		</>
	)
}
