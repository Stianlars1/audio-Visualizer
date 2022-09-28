import React from 'react';
import { Routes, Route, useNavigate, Navigate} from "react-router-dom";
import AddEditSong from './pages/AddEditSong';
import Home from './pages/Home';
import HomeAdmin from './pages/HomeAdmin';
import NavBar from './components/NavBar';

import { createContext, useState, useEffect } from 'react';


import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

import Form from './components/common/Form'



// testing
import Particles from "react-particles";
import { loadFull } from "tsparticles";






export const ThemeContext = createContext(null);
export const ColorContext = createContext(null)

const App = () => {
    const [theme, setTheme] = useState("dark");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();


    const particlesInit = async (main) => {
        console.log(main);
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
    };





    useEffect(() => {
        let authToken = localStorage.getItem('Auth Token')
    
        if (authToken) {
            navigate('/home');
        }
    }, [])


    // Handle register og login confusion..
    const handleLoginRegisterConfusion = (id) => {
        if (id === 1) {
            navigate("/register")
        }

        if (id === 2) {
            navigate("/login")
        }
    }


    // handle login
    const handleAction = (id) => {
        const authentication = getAuth();

        if (id === 2) {
            createUserWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                navigate('/home')
                localStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
            })

        }

        if (id === 1) {
            signInWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                navigate(email == "stian.larsen@mac.com" || email == "Stian.larsen@mac.com" ? '/adminHome' : '/home')
                localStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
            })
        }

        if (id === 3) {

            if (email == "stian.larsen@mac.com" || email == "Stian.larsen@mac.com") {
            signInWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                navigate('/adminHome')
                localStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
            })
            } else {
                alert("You have no access here...");
                navigate('/home');
            }
        }


    }

    const toggleTheme = () => {
        setTheme((current) => (current === "light" ? "dark" : "light"))
    };
    
    // React useEffect hook that will fire up
    // when "darkTheme" changes
    useEffect(() => {
        // Accessing scss variable "--background-color"
        // and "--text-color" using plain JavaScript
        // and changing the same according to the state of "darkTheme"
        const root = document.documentElement;
        root?.style.setProperty(
            "--color-page-background",
            theme === "light" ? "#fff" : "#06041E"
        );
        root?.style.setProperty("--color-text", theme === "light" ? "#06041E" : "#fff");
    }, [theme]);


    return (
        <div className='app' id={theme}>
                <ThemeContext.Provider value = {{theme, toggleTheme}}>


                        
                        <NavBar email = {email} toggleTheme={() => toggleTheme()}/>

                        {/* // handleaction() ?? */}
                        <Routes>
                            <Route path='/login' element={<Form 
                                                            setEmail={setEmail} 
                                                            setPassword={setPassword} 
                                                            handleAction={() => handleAction(1)}
                                                            handleLoginRegisterConfusion = {() => handleLoginRegisterConfusion(1)}
                                                            title="Login"
                                                            changeScreen="Go and Register"/>} 

                                                            />
                            <Route path='/register' element={<Form 
                                                                setEmail={setEmail}
                                                                setPassword={setPassword} 
                                                                handleAction = {() => handleAction(2)}
                                                                title="Register"
                                                                handleLoginRegisterConfusion = {() => handleLoginRegisterConfusion(2)}
                                                                changeScreen="Go to Login"/>} 

                                                                />
                            <Route path='/admin' element={<Form 
                                                                setEmail={setEmail}
                                                                setPassword={setPassword} 
                                                                handleAction = {() => handleAction(3)}
                                                                title="Do some admin stuff"
                                                                handleLoginRegisterConfusion = {() => handleLoginRegisterConfusion(2)}
                                                                changeScreen="Go to Login"     
                                                                />} 

                                                                />
                            <Route path="/" element={<Navigate to = "home" />} />
                            <Route path="/home" element={<Home email={email} theme = {theme} />} />
                            <Route path="/adminHome" element={<HomeAdmin email={email} theme = {theme} />} />
                            <Route path="/add" element={<AddEditSong email={email} />} />
                            <Route path="/update/:id" element={<AddEditSong />} />
                            <Route path="/audio-Visualizer" element={<Home />} />
                        </Routes>



                </ThemeContext.Provider>
        </div>

    );
}

export default App;
