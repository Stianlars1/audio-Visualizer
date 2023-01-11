
import React, {useState, useEffect} from 'react';
import {Storage, db} from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import {ScaleLoader} from 'react-spinners';
import { getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import Compress from "browser-image-compression";

const initialState = {
    title: "",
    artist: ""
};


// export function for adding and updating a song.
const AddEditSong = ({e, email}) => {

    // All the needed states for the "Add Song" page.
    const [data, setData] = useState(initialState);
    const {title, artist} = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const [imageFile, setImageFile] = useState(null);


    // Dynamic Background / NPM module
    const particlesInit = async (main) => {
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
    };


    // Check wheter a user is logged in or not
    useEffect(() => {
        let authToken = localStorage.getItem('Auth Token')

        if (authToken) {
            if (id) {
                return
            } else {
                navigate('/add')
            }
        }

        if (!authToken) {
            navigate('/home')
        }
    }, []);




    // When updating a current existing song, get id => www.website...no/update/ this.id (belongs to that song..) update that song
    useEffect(() => {
        id && getSingleUser()
    }, [id]);


    // gets that  specific song for update...
    const getSingleUser = async () => {
        const documentRef = doc(db, "songs", id);
        const snapshot = await getDoc(documentRef);
        if (snapshot.exists()) {
            setData({...snapshot.data()});
        }
    };

    // handle image upload
    useEffect(() => {

        // Should run only when a file is being set.. Run only when file is being uploaded. 
        const uploadFile = (e) => {
            if(!title || !artist) {
                alert("No input fields filled.");
                return;
            };



            const name = new Date().getTime() + imageFile.name;
            const storageRef = ref(Storage, 'audioVisualizer/images/'+ name);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);


            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);


                switch(snapshot.state) {
                    case "paused":
                        console.log("Uploading image paused..");
                        break;
                    case "running":
                        console.log("Upload image is running");
                        break;


                    default:
                        break; 
                    
                }
                }, (error) => {
                    console.log(error)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURLimage) => {
                        console.log("link to image-file:", downloadURLimage);
                        // save link to firestore database
                        setData((prev) => ({...prev, image: downloadURLimage}));
                        setIsSubmit(false);

                    });
                })



            // Start loader as the file is uploading to database / storage..
            /// Do something....

        };
        // triggers when file is SET
        imageFile && uploadFile()


    }, [imageFile]);


    



    // Handle AUDIO upload
    useEffect(() => {

        // Should run only when a file is being set.. Run only when file is being uploaded. 
        const uploadFile = (e) => {
            if(!title || !artist) {
                alert("No input fields filled.");
                return navigate("/add");
            };
            console.log(file.type);
            const name = new Date().getTime() + file.name;
            const storageRef = ref(Storage, 'audioVisualizer/audio/'+ name);
            const uploadTask = uploadBytesResumable(storageRef, file);


            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);


                switch(snapshot.state) {
                    case "paused":
                        console.log("Uploading paused..");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;


                    default:
                        break; 
                    
                }
                }, (error) => {
                    console.log(error)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("link to file:::", downloadURL);
                        // save link to firestore database
                        setData((prev) => ({...prev, audio: downloadURL}));
                        setIsSubmit(false);



                    });
                })



            // Start loader as the file is uploading to database / storage..
            /// Do something....

        };
        // triggers when file is SET
        
        file && uploadFile()


    }, [file]);

    // Take input (title, artist) and store in DATA state..
    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value});
    };

    // check for errors
    const validate = () => {
        let errors = {};
        
        if (!artist ) {
            errors.artist = "Artist is required";
            alert("Artist is required")
            return
        }

        if (artist) {
            if (!title) {
                alert("Title is required")
            }
        }
        return errors;
    };

    // Handle the submit + upload file... loading..
    const handleSubmit = async (event) => {
        event.preventDefault();
        let errors = validate();
        // check for errors
        if(Object.keys(errors).length) return setErrors(errors);

        // loading === true! this will start the loading spinner
        setIsSubmit(true);

        // if not ID === true? then => this is not an update, but a new instance..
        if(!id) {
            if ((file && imageFile) || id) {
            
                try {
                    await addDoc(collection(db, "songs"), {
                        ...data,
                        timestamp: serverTimestamp(),
                    })
                    
                } catch (error) {
                    console.log(error);
                }
            } else {
                alert("Some input fields was empty. No files selected 1/2?")
                navigate("/add")
            }
            
        } 

        // since ID of song was found, this will update that song instance
        else {
            try {
                await updateDoc(doc(db, "songs", id), {
                    ...data,
                    timestamp: serverTimestamp()
                })
            } catch (error) {
                console.log(error);
            }
        }

        // if Admin, return to admin page.
        if (email === "stian.larsen@mac.com" || email === "Stian.larsen@mac.com") {
            navigate("/adminHome");
        } 
        // if not admin, return to regular homepage
        else {
            navigate("/home");
        }
    };


    // compress and set img file
    function compressImage(e)  {
    if (email === "stian.larsen@mac.com" || email === "Stian.larsen@mac.com") {

        const file = e.target.files[0]
        // Compression config
        const options = {
            maxSizeMB: 1.5,
            useWebWorker: true
        }


        Compress(file, options)
        .then(compressedBlob => {
            compressedBlob.lastModifiedDate = new Date()

            // Conver the blob to file
            const convertedBlobFile = new File([compressedBlob], file.name, { type: file.type, lastModified: file.lastModified})
            setImageFile(convertedBlobFile);

            // Here you are free to call any method you are gonna use to upload your file example uploadToCloudinaryUsingPreset(convertedBlobFile)
        })
        .catch(e => {
            console.log("something went wrong compressing the image..");
            navigate("/add")
            return
        })

        setIsSubmit(true);
    } 

    else {alert("You have no access to upload images!"); navigate("/add");}
    }
    

    return (
        <div className='add_edit_container'>
            <div className='add_Edit_Song_container'>

                <div className='add_edit_wrapper'>
                    
                    {  
                        
                        isSubmit ? <ScaleLoader className='isSubmit_loader' color="#36d7b7"/>

                        :
                        (
                            <>
                            <h2>{ id ? "Update Song" : "Add song"}</h2>
                            <form className='form_wrapper' onSubmit={handleSubmit}>
                                <input
                                    className='input_text'
                                    autoFocus 
                                    error = {
                                        errors.artist ? { content: errors.artist } : null}
                                    type="text" 
                                    label="Title" 
                                    placeholder="Enter title.." 
                                    name='title' 
                                    value={title} 
                                    onChange={handleChange} />
                                <input  
                                    className='input_text'                                
                                    errors = {errors.artist ? {content: errors.artist} : null}
                                    type="text" 
                                    label="Arist" 
                                    placeholder="Enter artist name.." 
                                    name='artist' 
                                    value={artist} 
                                    onChange={handleChange} />
                                <div className='wrap_upload_submit'>
                                    <div className='input_files_btns'>
                                        <label htmlFor="uploadinput" className='upload_file_label'>Audio File</label>
                                        <input  
                                            id='uploadinput'
                                            name='uploadinput'
                                            className='input_file'
                                            type="file" 
                                            label="Upload" 

                                            onChange={(e) => {if (email === "stian.larsen@mac.com" || email === "Stian.larsen@mac.com")
                                            {setFile(e.target.files[0]); 
                                            setIsSubmit(true);} 
                                            else {alert("You have no access to this feature!"); navigate("/add");}}} />


                                            {/* IMG file */}
                                        <label htmlFor="uploadimageinput" className='upload_file_label'>Cover photo</label>
                                        <input  
                                            id='uploadimageinput'
                                            name='uploadinput'
                                            className='input_file'
                                            type="file" 
                                            label="Upload" 
                                            accept='image/*'

                                            onChange={compressImage}

                                            />
                                    </div>

                                    <button primary type="submit" disabled={progress !== null && progress < 100} className='add_edit_submit_btn' >Submit</button>
                                    <button onClick={(e) => {if (email === "stian.larsen@mac.com" || email === "Stian.larsen@mac.com") { navigate("/adminHome");} else {navigate("/home");}}} style={{margin: "20px 0px"}} className="add_edit_submit_btn">Back to home</button>
                                </div>
                            </form>
                            </>
                        )
                    }
                </div>

            </div>
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
        </div>
    )
}

export default AddEditSong