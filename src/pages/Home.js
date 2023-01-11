import React, { useEffect,  useState } from 'react';
import {collection,  onSnapshot} from 'firebase/firestore';
import {db} from '../firebase'
import { useNavigate} from 'react-router-dom';
import {ClipLoader} from 'react-spinners';
import AudioVisualizer from "../components/AudioVisualizer"
import Particles from "react-particles";
import { loadFull } from "tsparticles";






const Home = (props) => {

    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapSliceCount1, setMapSliceCount1] = useState();
    const [mapSliceCount2, setMapSliceCount2] = useState();
    const [atThisPage, setAtThisPage] = useState(1);
    const navigate = useNavigate();


    const alteredSongsList = [...songs].slice(mapSliceCount1, mapSliceCount2);


    const songList1 = JSON.parse(localStorage.getItem('songListCount1'));
    const songList2 = JSON.parse(localStorage.getItem('songListCount2'));
    const songpage = JSON.parse(localStorage.getItem('songpagecounter'));

    useEffect(() => {
        if (typeof(songList1) === typeof({})) {
            localStorage.setItem('songListCount1', 0);
            localStorage.setItem('songListCount2', 10);
            localStorage.setItem('songpagecounter', 1);
        } else {

            setMapSliceCount1(songList1)
            setMapSliceCount2(songList2)
            setAtThisPage(songpage)
        }
    }, []);





    const particlesInit = async (main) => {
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
    };


    // 1. Check if the user is signed in.. 
    // 2. If user is signed in, => navigate to this /home screen. ELSE: go to log in page..
    useEffect(() => {
        let authToken = localStorage.getItem('Auth Token')

        if (authToken != "visitor") {
            if (props.email === "stian.larsen@mac.com" || props.email === "Stian.larsen@mac.com") {
                navigate("/adminHome")
            } else {
                navigate('/home');
            }

        }

        if (authToken === "visitor") {
            console.log("You are a visitor");
            navigate("/home");
        }

        if ((!authToken || authToken === null) && !props.email) {
            navigate("/login");
        }
    }, []);



    // 1. Set loader when data is being collected.. (dynamic loader / spinner)
    // 2. Retrieve data from database, and push them to an useState Array "songs"
    // 3. stop loader / spinner, handle errors..
    useEffect(() => {
        setLoading(true);
        const retrieveSongs = onSnapshot(
            collection(db, "songs"), 
            (snapshot) => {
                let arrayList = [];
                snapshot.docs.forEach((doc) => {
                    arrayList.push({ id: doc.id, ...doc.data() });
                });
                arrayList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
                setSongs(arrayList);
                setLoading(false);

            }, 
            (error) => {
                console.log("Error while retrieving songs...: " + error);
            }

        );

        return () => {
            try {retrieveSongs()} 
            catch(error) {console.log("Error while retrieving songs...: " + error);}
            
        };
        
    }, []);

    

    function updateMapSliceNextSongs() {
        let countSongsInList = songs.length;
        let countedSongInList_converted = (Math.floor((countSongsInList / 10)) * 10);
        let countedSongInList_converted2 = ((Math.floor((countSongsInList / 10)) * 10) + 10);


        if (songList1 === countedSongInList_converted && songList2 === countedSongInList_converted2) {
            return
        } else {

            // setAtThisPage(atThisPage => atThisPage += 1);
            localStorage.setItem('songListCount1', songList1 + 10);
            localStorage.setItem('songListCount2', songList2 + 10);
            localStorage.setItem('songpagecounter', songpage + 1);
            setMapSliceCount1(mapSliceCount1 => mapSliceCount1 + 10);
            setMapSliceCount2(mapSliceCount2 => mapSliceCount2 + 10);
            setAtThisPage(atThisPage => atThisPage + 1);
        }

    }

    // To keep record of which song-playlist were at, this function will keep track of which "playlist" page we are at.
    function updateMapSlicePrevSongs() {
        if (songList1 === 0 && songList2 === 10){
            return
        } else {

            // To display which page were at. example: were at page 1 for sure, then it should says 1/x, where x = total of lists. 
            localStorage.setItem('songListCount1', songList1 - 10);
            localStorage.setItem('songListCount2', songList2 - 10);
            localStorage.setItem('songpagecounter', songpage - 1);

            setMapSliceCount1(mapSliceCount1 => mapSliceCount1 - 10);
            setMapSliceCount2(mapSliceCount2 => mapSliceCount2 - 10);
            setAtThisPage(atThisPage => atThisPage - 1);

        }

    }





    // Log out
    const handleLogout = () => {
        localStorage.removeItem('Auth Token');
        navigate('/login');
    };


    return (
        <div className='home_wrapper'>
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
            <>
            
                {loading ? 
                    <ClipLoader color="#36d7b7" />
                :

                    <div className='homepage_container'>
                        <h1 className='homeTitleSongs'>Songs</h1>
                        <button className='logOutButton' onClick={handleLogout}>Logout</button>
                        <div className='changeSongList'>
                            <div className='changeSongListButtons'>
                            <button className='changeSongListButton' onClick={updateMapSlicePrevSongs}>Prev songlist</button>
                            <button className='changeSongListButton' onClick={updateMapSliceNextSongs}>Next songlist</button>
                            </div>
                            <h2>{atThisPage} / {Math.ceil((songs.length / 10))}</h2>
                        </div>




                        {  
                                songs.length && alteredSongsList.map((data) => {

                                return (


                                    <article key={data.id} className='card'> 
                                        <div className='card_content'>
                                            <img className='card_image' src={data.image} alt=""/>

                                            <div className='song_info'>
                                            <h2>{data.title}</h2>
                                            <h4>{data.artist}</h4>
                                            </div>


                                            <div className='audio_wrapper'>
                                            <AudioVisualizer audio={data.audio}/>
                                            </div>

                                        </div>
                                    

                                    </article>
                                )
                            }) 

                        }
                    </div>
                }
            </>
        </div>
    )
}

export default Home
