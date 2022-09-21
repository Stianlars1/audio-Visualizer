import React, { useEffect, useState } from 'react';
import '../components/css/home/home.css';
import {collection, getDocs, onSnapshot} from 'firebase/firestore';
import {db} from '../firebase'
import { useNavigate } from 'react-router-dom';
import {ClipLoader} from 'react-spinners';
import AudioVisualizer from "../components/AudioVisualizer"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPen } from "@fortawesome/free-solid-svg-icons";



const Home = (props) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setLoading(true);
        const retrieveSongs = onSnapshot(
            collection(db, "songs"), 
            (snapshot) => {
                let arrayList = [];
                snapshot.docs.forEach((doc) => {
                    arrayList.push({ id: doc.id, ...doc.data() });
                });
                setSongs(arrayList);
                setLoading(false);

            }, 
            (error) => {
                console.log(error);
            }
        );

        return () => {
            retrieveSongs();
        };
        
    }, []);
    
    return (
        <div className='home_wrapper'>
            <>
            
                {loading ? 
                    <ClipLoader color="#36d7b7" />
                :

                    <div className='homepage_container'>
                    <h1 className='homeTitleSongs'>Songs</h1>

                        {   songs.map((data) => {

                            return (
                                <article key={data.id} className='card'>
                                    <div className='card_content'>
                                        <img className='card_image' src={data.image} />

                                        <div className='song_info'>
                                        <h2>{data.title}</h2>
                                        <h4>{data.artist}</h4>
                                        </div>


                                        <div className='audio_wrapper'>
                                        <AudioVisualizer audio={data.audio}/>
                                        </div>

                                    </div>

                                    <div className='card_content_extra'>
                                        
                                        <FontAwesomeIcon className="updateButton" onClick={() => navigate('/update/${data.id}')} icon={faPen} />

                                        {/* <button >Listen</button> */}
                                    </div>

                                    {/* <div id="waveform"></div>
                                        <button class="btn btn-primary" onclick="wavesurfer.playPause()">
                                        <i class="glyphicon glyphicon-play"></i>Play/Pause
                                        </button> */}
                                </article>
                            )
                        })}
                    </div>
                }
            </>
        </div>
    )
}

export default Home


