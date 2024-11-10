"use client";
import React, { useRef, useState, useEffect } from "react";
import "./ocr.css"

const CropDiseaseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [togglehide, settogglehide] = useState(true);
  const [toggleapp, settoggleapp] = useState(false);
  const[toggleExtra, settogglextra] = useState(false);
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // Default to back camera on mobile
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [diseasePrediction, setDiseasePrediction] = useState(null);

  // Toggle between front and back camera on mobile devices
  const toggleCamera = () => {
    settogglehide(true)
    settoggleapp(false)
    settogglextra(false)

    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };
  const toggleCamera_flip_1= ()=>{
    settogglehide(false)
    settoggleapp(true)
    settogglextra(false)
  }

  const toggleCamera_flip_2= ()=>{
    settogglehide(false)
    settoggleapp(false)
    settogglextra(true)
  }

  // Start video stream with the selected camera mode
  const startVideo = async () => {
    const constraints = {
      video: {
        facingMode: cameraFacingMode,
      },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsVideoPlaying(true);
    } catch (error) {
      console.error("Camera access error:", error);
    }
  };

  // Capture image from the video stream and send to backend
  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    sendImageToBackend();
  };

  // Send the captured image to the backend
  const sendImageToBackend = async () => {
    if (!canvasRef.current) return;

    // Convert canvas to Blob
    canvasRef.current.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "captured_image.jpg");

      try {
        const response = await fetch("http://localhost:5000/ocr/power", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setDiseasePrediction(data.prediction || "Unknown");
      } catch (error) {
        console.error("Error sending image to backend:", error);
      }
    }, "image/jpeg");
  };

  // Stop video stream when component is unmounted or video stopped
  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    setIsVideoPlaying(false);
  };
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("image", image);
    const response = await fetch("http://127.0.0.1:5000/ocr/power", {
      method: "POST",
      body,
    });
    const data = await response.json(); // Await the resolved JSON data
    console.log(data);
  };

  // Start the video stream when component mounts
  useEffect(() => {
    startVideo();
    return () => stopVideo(); // Stop video when component unmounts
  }, [cameraFacingMode]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <img src={createObjectURL} />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          <b>Send to server</b>
        </button>
      </div>
      <div className="video-container">
      <video
      className = 'video'
        ref={videoRef}
        width={togglehide? '60%': '0px'}
        height={togglehide? '60%': '0px'}
        style={{ display: (isVideoPlaying && togglehide)? "block" : "hide" }}
        autoPlay
        playsInline
        muted
      />
      </div>
      <div className ={toggleapp? 'appContainer': 'notAppContainer'} >
        <h2>Appliances Used: </h2>
        <div className= "appliance">AC</div>
        <div className= "appliance">Heater</div>
        <div className= "appliance">Microvawe</div>
        <div className= "appliance">Fridge</div>
        <div className= "appliance">Geyser</div>
        <div className= "appliance">Oven</div>
        <div className= "appliance">Iron</div>
      </div>

      <div className = {toggleExtra? 'extraContainer': 'notExtraContainer'}>
        <h2> How many people live ?</h2>
        <h2>Do You use EV ?</h2>
        <div className = "extra">Yes</div>
        <div className = "extra">No</div>
      </div>

      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
      <div>
        <button onClick={captureImage}>Capture and Send</button>
      </div>
      <div className="bottom-bar">
        <div className="first Slide" onClick={toggleCamera}>  
          1
        </div>
        <div className="second Slide" onClick={toggleCamera_flip_1}> 
          2
        </div>
        <div className="third Slide" onClick={toggleCamera_flip_2}> 
          3
        </div>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;
