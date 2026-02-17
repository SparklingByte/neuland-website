import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Blog.metadata' })

	return {
		title: t('title'),
		description: t('description')
	}
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <div className="relative z-10 pt-20 font-sans">{children}</div>
}
