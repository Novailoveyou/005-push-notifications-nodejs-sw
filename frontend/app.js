const VarsCtrl = (() => {
	const getKeys = () => {
		return {
			vapidPublic:
				'BMLm6sDkLNPTbWX_7TwI-I1-9J5tEVtbeq9Iph_Fue5KCILb0EP4xsmLz8SvEmG2mDeplGxJK-4lC1W3m9yvqk0'
		}
	}

	return {
		keys: getKeys()
	}
})()

const SwCtrl = (() => {
	const vapidPublicKey = VarsCtrl.keys.vapidPublic

	const registerSw = async (path = null, scope = '/') => {
		return await navigator.serviceWorker.register(path, {
			scope
		})
	}

	const registerPush = async () => {
		const register = await registerSw('/sw.js')
		return await register.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: vapidPublicKey
		})
	}

	const sendPush = async () => {
		const output = await fetch('/subscribe', {
			method: 'POST',
			body: JSON.stringify(await registerPush()),
			headers: {
				'content-type': 'application/json'
			}
		})
		console.log('Push sent')
		return output
	}

	const sw = async () => {
		try {
			sendPush()
		} catch (err) {
			console.error(`Service Worker: Error: ${err}`)
		}
	}

	return {
		sw
	}
})()

const UICtrl = (() => {
	const sw = SwCtrl.sw()
	const loadEvtListeners = () =>
		navigator.serviceWorker && window.addEventListener('load', sw)

	return {
		loadEvtListeners
	}
})()

const App = (UICtrl => {
	const init = () => UICtrl.loadEvtListeners()

	return { init }
})(UICtrl)

App.init()
