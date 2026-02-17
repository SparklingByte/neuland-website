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
import { fetchMultipleOutlineDocuments, OUTLINE_IDS } from '@/lib/outline-api'

export default async function DatenschutzOrdnung() {
	const result = await fetchMultipleOutlineDocuments([
		OUTLINE_IDS.datenschutzOrdnung,
		OUTLINE_IDS.datenschutzHinweise
	])

	const t = await getTranslations('Legal.NeulandPrivacy')

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
				<MarkdownContent content={result.content} showToc />
			) : (
				<FetchErrorMessage title={t('title')} error={result.error} />
			)}
		</div>
	)
}
