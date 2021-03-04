import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import Transition from "react-transition-group/cjs/Transition";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartInfo from './components/StartAlert'
import Home from "./components/Home";
import FiltersState from "./context/filtersState";

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'start',
    alignItems: 'start'
}

const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
};

const Fade = ({ in: inProp }) => (
    <Transition in={inProp} timeout={duration}>
        {state => (
            <div style={{
                ...defaultStyle,
                ...transitionStyles[state]
            }}>

                I'm a fade Transition!
            </div>
        )}
    </Transition>
);

function App() {
    const [inProp, setInProp] = useState(true);

    return (
        <FiltersState>
            <div className="app">
                <Transition in={inProp} appear={inProp} timeout={500}>
                    {state => (
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                        }}>
                            <StartInfo/>
                            <Home/>
                        </div>
                    )}
                </Transition>
            </div>
        </FiltersState>
    );
}

export default App;
