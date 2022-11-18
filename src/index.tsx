import ReactDOM from 'react-dom/client'
import Gallery from './Gallery'
import './index.css'

const context = require.context('./thumbnails', false, /\.jpeg$/)
const thumbnails = context.keys().map(key => {
  return {
    id: key.slice(2, -5),
    src: context(key),
  }
})

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(<Gallery images={thumbnails} />)

