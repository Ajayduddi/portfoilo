import { render } from 'solid-js/web';
import App from './App';
import { MotionProvider } from './context/MotionContext';
import './styles/index.css';

render(() => <MotionProvider><App /></MotionProvider>, document.getElementById('root')!);
