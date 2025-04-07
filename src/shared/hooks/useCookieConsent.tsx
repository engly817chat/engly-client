import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { storageKeys } from '@/shared/constants'


export const useCookieConsent = () => {
	const [consent, setConsent] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)


	useEffect(() => {
		const savedConsent = Cookies.get(storageKeys.cookieConsent)
		if (savedConsent) {
			setConsent(savedConsent)
		}
    setLoading(false)
	}, [])

	const acceptCookies = () => {
		Cookies.set(storageKeys.cookieConsent, 'accepted', {
			sameSite: 'strict',
			expires: 365,
		})
		setConsent('accepted')
	}

	const declineCookies = () => {
		Cookies.set(storageKeys.cookieConsent, 'declined', {
			sameSite: 'strict',
			expires: 365,
		})
		setConsent('declined')
	}

	return {consent, acceptCookies, declineCookies, loading}
}