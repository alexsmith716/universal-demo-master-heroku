require('colors')
const express = require('express')
const webpack = require('webpack')
const noFavicon = require('express-no-favicons')
const clientConfig = require('../webpack/client.dev')
const serverConfig = require('../webpack/server.dev')
const clientConfigProd = require('../webpack/client.prod')
const serverConfigProd = require('../webpack/server.prod')

const { publicPath } = clientConfig.output
const outputPath = clientConfig.output.path
const DEV = process.env.NODE_ENV === 'development'
const app = express()

const port = process.env.PORT || 8080;

app.set('port', port);
app.use(noFavicon())

let isBuilt = false

const done = () => !isBuilt
  && app.listen(app.get('port'), () => {
    isBuilt = true
    console.log('BUILD COMPLETE -- Listening @ http://localhost:3000'.magenta)
  })

webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
  const clientStats = stats.toJson().children[0]
  const serverRender = require('../buildServer/main.js').default

  app.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats }))

  done()
})
