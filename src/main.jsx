import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/app/App'
import MarvelService from './services/MarvelService';
import "./style/style.scss";

const marvelService = new MarvelService();

marvelService.getAllCharacters().then(res=> res.data.results.forEach(item=> console.log(item.name)))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)