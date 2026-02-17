import { getTranslations } from 'next-intl/server'
import TypewriterText from '@/components/typewriter-text'

export default async function ClientIntro() {
	const t = await getTranslations('Home.clientIntro')

	return (
		<div className={'pt-20'}>
			<TypewriterText
				text={t('typewriter')}
				className="text-xl mb-12 font-mono font-semibold text-terminal-text/90"
				delay={25}
				preventLayoutJumps={true}
			/>
		</div>
	)
}
