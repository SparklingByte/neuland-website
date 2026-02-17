import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Neuland Ingolstadt Blog',
	description:
		'Blog des Neuland Ingolstadt e.V. - Informatik- und Technikthemen, Events und Workshops'
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <div className="relative z-10 pt-20 font-sans">{children}</div>
}
