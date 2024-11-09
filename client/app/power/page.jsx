"use client";
import React, { useRef, useState, useEffect } from "react";

const CropDiseaseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // Default to back camera on mobile
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [diseasePrediction, setDiseasePrediction] = useState(null);

  // Toggle between front and back camera on mobile devices
  const toggleCamera = () => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };

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
      <video
        ref={videoRef}
        width="60%"
        height="60%"
        style={{ display: isVideoPlaying ? "block" : "none" }}
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
      <div>
        <button onClick={toggleCamera}>Switch Camera</button>
        <button onClick={captureImage}>Capture and Send</button>
      </div>
      {diseasePrediction && (
        <div style={{ marginTop: "20px", fontSize: "18px", color: "green" }}>
          <strong>Prediction:</strong> {diseasePrediction}
        </div>
      )}
    </div>
  );
};

export default CropDiseaseDetection;
