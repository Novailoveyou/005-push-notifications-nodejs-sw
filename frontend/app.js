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

  const registerSw = async ({ path = null, scope = '/' }) => {
    return await navigator.serviceWorker.register(path, {
      scope
    })
  }

  const registerPush = async ({
    registerFunc = null,
    path = null,
    scope,
    key = null
  }) => {
    const register = await registerFunc({ path, scope })
    return await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key
    })
  }

  const sendPush = async ({
    registerFunc = null,
    path = null,
    scope,
    key = null,
    pushFunc = null,
    route = null
  }) => {
    const body = JSON.stringify(
      await pushFunc({
        registerFunc,
        path,
        scope,
        key
      })
    )
    return await fetch(route, {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  const sw = async () => {
    try {
      navigator.serviceWorker &&
        sendPush({
          registerFunc: registerSw,
          path: './sw.js',
          key: vapidPublicKey,
          pushFunc: registerPush,
          route: '/subscribe'
        })
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
  const loadEvtListeners = () => window.addEventListener('load', sw)

  return {
    loadEvtListeners
  }
})()

const App = (UICtrl => {
  const init = () => UICtrl.loadEvtListeners()

  return { init }
})(UICtrl)

App.init()
