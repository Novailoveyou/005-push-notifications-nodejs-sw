self.addEventListener('push', e => {
	const data = e.data.json()
	console.log(data)
	self.registration.showNotification(data.title, {
		body: 'Notified by Nover',
		icon: 'https://novailoveyou.com/img/favicon.ico'
	})
})
