import React from 'react';
import { useState, useRef, useEffect } from 'react';
import wavesurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause, faTrash } from "@fortawesome/free-solid-svg-icons";
import {ThemeContext} from '../App'
import { useContext } from 'react';




const AudioVisualizer = (props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5);
    
    
    const playButton = faCirclePlay;
    const pauseButton = faCirclePause;
    
    
    const audioRef = useRef(null);
    const audioTrackRef= useRef(undefined);

    const audioColor = useContext(ThemeContext)

    // if i want to change the audio waveform color later on, driven by the "theme" darkmode/lightmode switch::
    let  audioColorr = audioColor.theme;


    // Create audio waveform object, and load song from database..
    useEffect(()=>{
        let abortController = new AbortController();  

        if (audioRef.current){
                audioTrackRef.current = wavesurfer.create({
                container: audioRef.current,
                progressColor: "#13AEA2",
                waveColor: "red",
                cursorColor: "OrangeRed",
                backend: "MediaElement", // originally = "MediaElement"
                barWidth: 2,
                barHeight: 1, // the height of the wave
                fillParent: true,
                hideScrollbar: true,
                responsive: true,
                pixelRatio: 1,
                
            });
            audioTrackRef.current.load(props.audio);

        
        }

        return () => {  
            abortController.abort();  
            }  
    }, [])   
    

    // DarkMode // LightMode === => Only used if you want to change color... i like the color red for both light an ddark for now..
    // Uncomment down below for theme driven wavform color! :)!
    // useEffect(() => {
    //     audioColorr === "light" ? audioTrackRef.current.backend.params.waveColor = "red" : audioTrackRef.current.backend.params.waveColor = "red";
    // }, []);



    // Change volume from:: form input-slider
    const onVolumeChange = e => {
        const { target } = e;
        const newVolume = +target.value;
        
    
        if (newVolume) {
            setVolume(volume => newVolume);
            audioTrackRef.current.setVolume(newVolume || 1);
        }
    };

    const buttonRef = useRef();
    // Handle play pause button
    const handlePlayPause =  (e) => {
        // Get a view of what the "click" registers:

        // if playing == pause
        if ( ! isPlaying ) {
            console.log("Play:");

                        // play
            audioTrackRef.current.play()
            setIsPlaying(isClicked => true)

            // Highlight the card playing
            let cardref = buttonRef.current.closest(".card");
            cardref.className = "cardSelected";

            return

        } 
        else {
                        // Highlight the card playing

            let cardref = buttonRef.current.closest(".cardSelected");
            cardref.className = "card";
            console.log("Pause")

            // pause
            audioTrackRef.current.pause()
            setIsPlaying(isClicked => false);

            return
        }


        
    
    };

    
    return (
        <>
            <div  className='audio'  ref={audioRef}>
            </div> 
            <div className='audioKnobs'>
                


                <button ref={buttonRef}  className="playpausewrapper" onClick={handlePlayPause}>
                        <FontAwesomeIcon className={ isPlaying ? 'playButton activeButton' : 'playButton notActiveButton'} icon={ isPlaying ? pauseButton : playButton} />
                </button>

                <input type="range" className='VolumeSlider onPhoneRemoveVolumeSlider' id="volume" name="volume" min="0.01" max="1" step=".025" onChange={onVolumeChange} defaultValue={volume}/>
            </div>
        </>
    )
}


export default AudioVisualizer;