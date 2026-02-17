import { getTranslations } from 'next-intl/server'
import FetchErrorMessage from '@/components/Markdown/fetch-error-message'
import MarkdownContent from '@/components/Markdown/markdown-content'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Link } from '@/i18n/navigation'
import { fetchOutlineDocument, OUTLINE_IDS } from '@/lib/outline-api'

export default async function Satzung() {
	const result = await fetchOutlineDocument(OUTLINE_IDS.satzung)

	const t = await getTranslations('Legal.Bylaws')

	return (
		<div className="pt-20">
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>{t('breadcrumb')}</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{result.success && result.content ? (
				<MarkdownContent
					content={`# ${result.title}\n\n${result.content}`}
					showToc
				/>
			) : (
				<FetchErrorMessage title={t('title')} error={result.error} />
			)}
		</div>
	)
}
