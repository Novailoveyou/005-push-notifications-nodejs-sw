require('dotenv').config()
const express = require('express')
const webpush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

// Set static path
app.use(express.static(path.join(__dirname, 'frontend')))

app.use(bodyParser.json())

const publicVapidKey = process.env.VAPID_PUBLIC_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

// Subcribe Route
app.post('/subscribe', (req, res) => {
	// Get pushSubscription object
	const subscription = req.body

	// Send 201 - resource created
	res.status(201).json({})

	// Create payload
	const payload = JSON.stringify({ title: 'Push Test' })

	// Pass object into sendNotification
	webpush
		.sendNotification(subscription, payload)
		.catch(err => console.error(err))
})

const port = 5001

app.listen(port, () => console.log(`Server started on port ${port}`))
