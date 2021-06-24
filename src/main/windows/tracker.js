const tracker = module.exports = {
  init,
  win: null
}

const config = require('../../config')
const { BrowserWindow } = require('electron')
const BitTorrentTrackerServer = require('bittorrent-tracker').Server

new BitTorrentTrackerServer({
  udp: false,
  http: true,
  ws: false,
  stats: true
}).listen(60000)

function init () {

  if (tracker.win) {
    return tracker.win.show()
  }

  const win = tracker.win = new BrowserWindow({
    backgroundColor: '#ECECEC',
    center: true,
    fullscreen: false,
    height: 480,
    icon: getIconPath(),
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    title: 'BitTorrent Tracker Server ' + config.APP_WINDOW_TITLE,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableBlinkFeatures: 'AudioVideoTracks',
      enableRemoteModule: true,
      backgroundThrottling: false
    },
    width: 600
  })

  win.loadURL('http://localhost:60000/stats')

  win.once('ready-to-show', function () {
    win.show()
    // No menu on the About window
    // Hack: BrowserWindow removeMenu method not working on electron@7
    // https://github.com/electron/electron/issues/21088
    win.setMenuBarVisibility(false)
  })

  win.once('closed', function () {
    tracker.win = null
  })
}

function getIconPath () {
  return process.platform === 'win32'
    ? config.APP_ICON + '.ico'
    : config.APP_ICON + '.png'
}
