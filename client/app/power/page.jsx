'use client'

import React, { useRef, useState, useEffect } from "react"
import { Camera, Leaf, Users, Zap, Upload, RefreshCw } from "lucide-react"

export default function EcoFriendlyEnergyTracker() {
  const videoRef = useRef(null)
  const [activeStep, setActiveStep] = useState(1)
  const [appliances, setAppliances] = useState({})
  const [residents, setResidents] = useState("")
  const [usesEV, setUsesEV] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const applianceList = [
    "AC",
    "Heater",
    "Microwave",
    "Refrigerator",
    "Geyser",
    "Washing Machine",
    "Kettle",
    "Oven",
    "Iron",
    "Blender",
    "Television",
    "PC",
    "Vacuum",
    "Grinder",
  ]

  const usageCategories = ["Low", "Moderate", "High", "Very High"]

  useEffect(() => {
    if (activeStep === 1) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [activeStep])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCameraActive(true)
    } catch (error) {
      console.error("Camera access error:", error)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject
    const tracks = stream?.getTracks()
    tracks?.forEach((track) => track.stop())
    setCameraActive(false)
  }

  const captureImage = () => {
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0)
    const imageDataUrl = canvas.toDataURL("image/jpeg")
    setCapturedImage(imageDataUrl)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setCapturedImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const toggleAppliance = (appliance) => {
    setAppliances((prev) => ({
      ...prev,
      [appliance]: prev[appliance] ? null : "Low",
    }))
  }

  const updateApplianceUsage = (appliance, usage) => {
    setAppliances((prev) => ({
      ...prev,
      [appliance]: usage,
    }))
  }

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="relative w-full h-[calc(100vh-280px)] max-h-[600px]">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="object-cover w-full h-full"
              />
            ) : (
              <video
                ref={videoRef}
                className="object-cover w-full h-full"
                playsInline
                muted
              />
            )}
            {cameraActive && (
              <div className="absolute px-3 py-1 text-sm text-white bg-green-600 rounded-full top-4 right-4">
                Camera is active
              </div>
            )}
            <div className="absolute flex justify-center space-x-4 bottom-4 left-4 right-4">
              {!capturedImage ? (
                <button
                  onClick={captureImage}
                  className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Capture Image
                </button>
              ) : (
                <button
                  onClick={retakePhoto}
                  className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <RefreshCw className="inline-block mr-2" size={18} />
                  Retake Photo
                </button>
              )}
              <label className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg cursor-pointer hover:bg-green-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="inline-block mr-2" size={18} />
                Upload Image
              </label>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-800">
              Select Your Appliances and Usage
            </h2>
            <ul className="space-y-4">
              {applianceList.map((appliance) => (
                <li key={appliance} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <button
                    onClick={() => toggleAppliance(appliance)}
                    className={`flex-grow p-3 rounded-lg text-sm font-medium transition-colors mb-2 sm:mb-0 ${
                      appliances[appliance]
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {appliance}
                  </button>
                  {appliances[appliance] && (
                    <div className="flex flex-wrap gap-2">
                      {usageCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => updateApplianceUsage(appliance, category)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            appliances[appliance] === category
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <label
                htmlFor="residents"
                className="block text-xl font-semibold text-green-800"
              >
                How many people live in your household?
              </label>
              <input
                type="number"
                id="residents"
                value={residents}
                onChange={(e) => setResidents(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="1"
                placeholder="Enter number of residents"
              />
            </div>
            <div className="space-y-4">
              <p className="block text-xl font-semibold text-green-800">
                Do you use an Electric Vehicle (EV)?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setUsesEV(true)}
                  className={`flex-1 px-6 py-3 text-lg font-medium rounded-lg transition-colors ${
                    usesEV === true
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setUsesEV(false)}
                  className={`flex-1 px-6 py-3 text-lg font-medium rounded-lg transition-colors ${
                    usesEV === false
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    }
  }

  const submitData = async () => {
    const formData = new FormData()

    if (capturedImage) {
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      formData.append("image", blob, "captured_image.jpg")
    }

    formData.append("appliances", JSON.stringify(appliances))
    formData.append("residents", residents)
    formData.append("usesEV", usesEV)

    try {
      const response = await fetch("/api/submit-energy-data", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Data submitted successfully!")
      } else {
        alert("Failed to submit data. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting data:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-3xl p-4 mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-10 h-10 mr-3 text-green-600" />
            <h1 className="text-3xl font-bold text-center text-green-800">
              Eco-Friendly Energy Tracker
            </h1>
          </div>

          {renderStep()}
        </div>
      </div>

      <div className="bg-white shadow-lg">
        <div className="max-w-3xl p-4 mx-auto">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`flex items-center justify-center w-16 h-16 rounded-full text-lg font-medium transition-colors ${
                  activeStep === step
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {step === 1 && <Camera className="w-8 h-8" />}
                {step === 2 && <Zap className="w-8 h-8" />}
                {step === 3 && <Users className="w-8 h-8" />}
              </button>
            ))}
          </div>
          {activeStep < 3 ? (
            <button
              onClick={nextStep}
              className="w-full py-3 mt-6 text-lg font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={submitData}
              className="w-full py-3 mt-6 text-lg font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              Submit Data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}