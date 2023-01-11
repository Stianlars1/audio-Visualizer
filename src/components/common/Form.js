import * as React from 'react';
import Button from './Button';

// testing
import Particles from "react-particles";
import { loadFull } from "tsparticles";




export default function BasicTextFields({title, setPassword, setEmail, handleAction, changeScreen, handleLoginRegisterConfusion, seeWithoutLoggingIn, seeWithoutLogin}) {

    // background dynamic
    const particlesInit = async (main) => {
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
    };

    return (
        <div className='form_container'>
                        <Particles
                        id="tsparticles"
                        className='testParticle'
                        init={particlesInit}

                        options={{
                            "fullScreen": {
                                "enable": true,
                                "zIndex": 1
                            },
                            "particles": {
                                "number": {
                                    "value": 10,
                                    "density": {
                                        "enable": false,
                                        "value_area": 800
                                    }
                                },
                                "color": {
                                    "value": "#fff"
                                },
                                "shape": {

                                    "options": {
                                        "sides": 5
                                    }
                                },
                                "opacity": {
                                    "value": 0.8,
                                    "random": false,
                                    "anim": {
                                        "enable": false,
                                        "speed": 1,
                                        "opacity_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "size": {
                                    "value": 4,
                                    "random": false,
                                    "anim": {
                                        "enable": false,
                                        "speed": 40,
                                        "size_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "rotate": {
                                    "value": 0,
                                    "random": true,
                                    "direction": "clockwise",
                                    "animation": {
                                        "enable": true,
                                        "speed": 5,
                                        "sync": false
                                    }
                                },
                                "line_linked": {
                                    "enable": true,
                                    "distance": 600,
                                    "color": "#ffffff",
                                    "opacity": 0.4,
                                    "width": 2
                                },
                                "move": {
                                    "enable": true,
                                    "speed": 2,
                                    "direction": "none",
                                    "random": false,
                                    "straight": false,
                                    "out_mode": "out",
                                    "attract": {
                                        "enable": false,
                                        "rotateX": 600,
                                        "rotateY": 1200
                                    }
                                }
                            },
                            "interactivity": {
                                "events": {
                                    "onhover": {
                                        "enable": false,
                                        "mode": ["grab"]
                                    },
                                    "onclick": {
                                        "enable": false,
                                        "mode": "bubble"
                                    },
                                    "resize": true
                                },
                                "modes": {
                                    "grab": {
                                        "distance": 400,
                                        "line_linked": {
                                            "opacity": 1
                                        }
                                    },
                                    "bubble": {
                                        "distance": 400,
                                        "size": 40,
                                        "duration": 2,
                                        "opacity": 8,
                                        "speed": 3
                                    },
                                    "repulse": {
                                        "distance": 200
                                    },
                                    "push": {
                                        "particles_nb": 4
                                    },
                                    "remove": {
                                        "particles_nb": 2
                                    }
                                }
                            },
                            "retina_detect": true,
                            "background": {
                                "color": "#111",
                                "image": "",
                                "position": "50% 50%",
                                "repeat": "no-repeat",
                                "size": "cover"
                            }
                        }}
                        />
            <div className='form_wrapper'>
                <div className="form-heading">
                        <h3>
                            {title} Here
                        </h3>
                </div>


                <div className='formBox'>
                    <form>
                        <input autoComplete='username' placeholder='Email..' className='input_text' onChange={(e) => setEmail(e.target.value)} id = "email" label="Enter your Email"></input>
                        <input autoComplete='current-password' placeholder='Password..' className='input_text' type="password" onChange={(e) => setPassword(e.target.value)} id = "password" label="Enter your Password"></input>
                    </form>
                </div>
                

                <Button handleAction={handleAction} title={title}/>
                <Button handleAction={handleLoginRegisterConfusion} title={changeScreen}/>
                <Button handleAction={seeWithoutLogin} title={seeWithoutLoggingIn}/>
            </div>
        </div>
    );
}