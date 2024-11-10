'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Camera, Leaf, Users, Zap, Upload, RefreshCw } from 'lucide-react'
import Sidebar from '../dashboard/sidebar'

export default function EcoFriendlyEnergyTracker() {
  const videoRef = useRef(null)
  const [activeStep, setActiveStep] = useState(1)
  const [appliances, setAppliances] = useState({})
  const [residents, setResidents] = useState('')
  const [usesEV, setUsesEV] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const applianceList = ['AC', 'Heater', 'Microwave', 'Fridge', 'Geyser', 'Oven', 'Iron']

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
      console.error('Camera access error:', error)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject
    const tracks = stream?.getTracks()
    tracks?.forEach(track => track.stop())
    setCameraActive(false)
  }

  const captureImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    const imageDataUrl = canvas.toDataURL('image/jpeg')
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
    setAppliances(prev => ({
      ...prev,
      [appliance]: prev[appliance] ? null : 0
    }))
  }

  const updateApplianceHours = (appliance, hours) => {
    setAppliances(prev => ({
      ...prev,
      [appliance]: hours
    }))
  }

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div id="camera-container" className="relative w-full h-[calc(100vh-280px)] max-h-[600px]">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
            )}
            {cameraActive && (
              <div id="camera-status" className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                Camera is active
              </div>
            )}
            <div id="camera-controls" className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
              {!capturedImage ? (
                <button
                  id="capture-button"
                  onClick={captureImage}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Camera className="h-8 w-8" />
                </button>
              ) : (
                <button
                  id="retake-button"
                  onClick={retakePhoto}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <RefreshCw className="inline-block mr-2" size={28} />
                  
                </button>
              )}
              <label id="upload-label" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <Upload className="inline-block " size={28} />
                
              </label>
            </div>
          </div>
        )
      case 2:
        return (
          <div id="appliances-container" className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-800">Select Your Appliances</h2>
            <ul className="space-y-4">
              {applianceList.map(appliance => (
                <li key={appliance} className="flex items-center space-x-4">
                  <button
                    id={`appliance-${appliance}`}
                    onClick={() => toggleAppliance(appliance)}
                    className={`flex-grow p-3 rounded-lg text-sm font-medium transition-colors ${
                      appliances[appliance] !== undefined
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {appliance}
                  </button>
                  {appliances[appliance] !== undefined && (
                    <input
                      id={`hours-${appliance}`}
                      type="number"
                      min="0"
                      max="24"
                      value={appliances[appliance] || ''}
                      onChange={(e) => updateApplianceHours(appliance, e.target.value)}
                      className="w-20 p-2 border border-green-300 rounded-md text-green-800 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Hours"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      case 3:
        return (
          <div id="household-info" className="space-y-8">
            <div id="residents-container" className="space-y-4">
              <label htmlFor="residents" className="block text-xl font-semibold text-green-800">
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
            <div id="ev-usage-container" className="space-y-4">
              <p className="block text-xl font-semibold text-green-800">Do you use an Electric Vehicle (EV)?</p>
              <div className="flex space-x-4">
                <button
                  id="ev-yes"
                  onClick={() => setUsesEV(true)}
                  className={`flex-1 px-6 py-3 text-lg font-medium rounded-lg transition-colors ${
                    usesEV === true ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  id="ev-no"
                  onClick={() => setUsesEV(false)}
                  className={`flex-1 px-6 py-3 text-lg font-medium rounded-lg transition-colors ${
                    usesEV === false ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'
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
    
    // Append image data
    if (capturedImage) {
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      formData.append('image', blob, 'captured_image.jpg')
    }

    // Append appliances data
    formData.append('appliances', JSON.stringify(appliances))

    // Append household info
    formData.append('residents', residents)
    formData.append('usesEV', usesEV)

    try {
      const response = await fetch('/api/submit-energy-data', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('Data submitted successfully!')
        // Reset form or redirect user as needed
      } else {
        alert('Failed to submit data. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div id="eco-tracker" className="min-h-screen bg-green-50 flex flex-col">
        <Sidebar  />
      <div id="content-container" className="flex-grow overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4">
          <div id="header" className="flex items-center justify-center mb-6">
            <Leaf className="h-10 w-10 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-center text-green-800">Eco-Friendly Energy Tracker</h1>
          </div>

          {renderStep()}

        </div>
      </div>

      <div id="navigation" className="bg-white shadow-lg">
        <div className="max-w-3xl mx-auto p-4">
          <div id="step-buttons" className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                id={`step-${step}`}
                onClick={() => setActiveStep(step)}
                className={`flex items-center justify-center w-16 h-16 rounded-full text-lg font-medium transition-colors ${
                  activeStep === step
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {step === 1 && <Camera className="h-8 w-8" />}
                {step === 2 && <Zap className="h-8 w-8" />}
                {step === 3 && <Users className="h-8 w-8" />}
              </button>
            ))}
          </div>
          {activeStep < 3 ? (
            <button
              id="next-step"
              onClick={nextStep}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              id="submit-data"
              onClick={submitData}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              Submit Data
            </button>
          )}
        </div>
      </div>
      </div>
    
  )
}