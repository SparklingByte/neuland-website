import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ProjectDetails } from '@/components/Projects/project-card'
import projectsData from '@/data/projects.json'
import { routing } from '@/i18n/routing'
import ProjectDetailClient from './project-detail-client'

export const generateStaticParams = async () => {
	const locales = routing.locales

	return locales.flatMap((locale) =>
		(projectsData as ProjectDetails[]).map((project) => ({
			id: project.id,
			locale: locale
		}))
	)
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string; id: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Projects.metadata' })

	const { id } = await params
	const project = (projectsData as ProjectDetails[]).find((p) => p.id === id)

	if (!project) {
		return {
			title: t('notFound')
		}
	}

	return {
		title: `${project.title} - Neuland Projekte`
	}
}

const ProjectDetailPage = async ({
	params
}: {
	params: Promise<{ id: string; locale: string }>
}) => {
	const { id, locale } = await params
	setRequestLocale(locale)
	const project = (projectsData as ProjectDetails[]).find((p) => p.id === id)
	
	if (!project) {
		notFound()
	}

	return <ProjectDetailClient project={project} />
}

export default ProjectDetailPage
