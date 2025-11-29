import moment from 'moment'
import 'moment/locale/de'
import 'moment-timezone'

moment.tz.setDefault('Europe/Berlin')

// Legacy interface removed in favor of PublicEventResponse below

interface Event {
	title: string
	date: string
	location: string
	description: string
	nextOccurrence: string
	isInternal: boolean
}

// RRule translations and helpers removed because events are no longer recurring

function getDateStr(startDate: moment.Moment, event: PublicEventResponse) {
	if (!startDate.isValid()) {
		return 'tbd'
	}

	const localStartDate = startDate.tz('Europe/Berlin')
	const formattedStart = localStartDate.format('DD.MM.YYYY, HH:mm')

	let dateStr = formattedStart
	if (event.end_date_time) {
		const endDate = moment(event.end_date_time).tz('Europe/Berlin')
		if (localStartDate.isSame(endDate, 'day')) {
			dateStr += ` - ${endDate.format('HH:mm')}`
		} else {
			dateStr += ` - ${endDate.format('DD.MM.YYYY, HH:mm')}`
		}
	}

	return dateStr
}

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ??
	'https://cl.neuland-ingolstadt.de/api/ical/4/events'

let cachedEvents: { semester: string; events: Event[] } | null = null
let cacheTimestamp = 0
const CACHE_TTL = 300000
export type PublicEventResponse = {
	description_de?: string | null
	description_en?: string | null
	end_date_time?: string | null
	event_url?: string | null
	id: number
	location?: string | null
	organizer_id: number
	start_date_time: string
	title_de: string
	title_en: string
	is_internal: boolean
}

export const fetchEvents = async (): Promise<{
	semester: string
	events: Event[]
}> => {
	const now = Date.now()
	if (cachedEvents && now - cacheTimestamp < CACHE_TTL) {
		return cachedEvents
	}

	try {
		const response = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.CL_API_KEY}`
			},
			next: { revalidate: 300 }
		})

		if (!response.ok) {
			throw new Error(
				`API responded with status: ${response.status}: ${response.statusText}`
			)
		}

		const responseData = await response.json()
		console.log(responseData)
		function getSemesterFromDate(date: moment.Moment): string {
			const year = date.year()
			const month = date.month() + 1 // moment months are 0-based

			if (month >= 4 && month <= 9) {
				return `SS ${year}`
			}
			const winterYear = month <= 3 ? year - 1 : year
			const winterYearNext = month <= 3 ? year : year + 1
			return `WS ${winterYear}/${winterYearNext.toString().slice(-2)}`
		}

		const events = responseData.map((event: PublicEventResponse): Event => {
			moment.locale('de')

			const startDate = moment(event.start_date_time).tz('Europe/Berlin')
			const dateStr = getDateStr(startDate, event)
			const nextOccurrence = startDate

			return {
				title: event.title_de,
				date: dateStr,
				location: event.location || '',
				description: event.description_de || '',
				isInternal: event.is_internal,
				nextOccurrence: nextOccurrence.isValid()
					? nextOccurrence.toISOString()
					: ''
			}
		})

		const filteredEvents = events
			.filter((event: Event) => {
				if (!event.nextOccurrence) return false
				const nextDate = new Date(event.nextOccurrence)
				return nextDate >= new Date()
			})
			.sort((a: Event, b: Event) => {
				const dateAValid = a.nextOccurrence !== ''
				const dateBValid = b.nextOccurrence !== ''

				if (!dateAValid && !dateBValid) {
					return a.title.localeCompare(b.title)
				}

				if (!dateAValid) return 1
				if (!dateBValid) return -1

				const dateA = new Date(a.nextOccurrence)
				const dateB = new Date(b.nextOccurrence)

				if (dateA < dateB) {
					return -1
				}
				if (dateA > dateB) {
					return 1
				}
				return 0
			})

		// Determine semester based on first event or fallback to current date
		let semester: string
		if (filteredEvents.length > 0 && filteredEvents[0].nextOccurrence) {
			const firstEventDate = moment(filteredEvents[0].nextOccurrence)
			semester = getSemesterFromDate(firstEventDate)
		} else {
			const now = moment()
			semester = getSemesterFromDate(now)
		}

		const result = {
			semester,
			events: filteredEvents
		}

		cachedEvents = result
		cacheTimestamp = now

		return result
	} catch (error) {
		console.error('Error fetching events:', error)
		throw error
	}
}
