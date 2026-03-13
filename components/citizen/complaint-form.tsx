'use client'

import { useState, useRef } from 'react'
import { Mic, Camera, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Complaint } from '@/lib/types'
import DuplicateAlertModal from './duplicate-alert-modal'

interface ComplaintFormProps {
  onSubmit?: (data: FormData) => Promise<void>
  isLoading?: boolean
  categories?: string[]
}

export default function ComplaintForm({ 
  onSubmit, 
  isLoading = false,
  categories = ['Pothole', 'Street Light', 'Water Leakage', 'Garbage', 'Traffic', 'Other']
}: ComplaintFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: categories[0],
    latitude: null as number | null,
    longitude: null as number | null,
  })
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioExtension, setAudioExtension] = useState('webm')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Reverse geocode using Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          const address = data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`

          setFormData(prev => ({
            ...prev,
            location: address,
            latitude,
            longitude
          }))
        } catch (err) {
          console.error('Reverse geocoding failed:', err)
          // Fallback to coordinates if address lookup fails
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
            latitude,
            longitude
          }))
        } finally {
          setIsGettingLocation(false)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        if (err.code === 1) {
          setError('Location access denied. Please enter location manually.')
        } else {
          setError('Failed to retrieve location. Please enter location manually.')
        }
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Start AI Analysis
      setIsAnalyzing(true)
      try {
        const analyzeData = new FormData()
        analyzeData.append('image', file)

        const res = await fetch('/api/ai/analyze-image', {
          method: 'POST',
          body: analyzeData,
        })

        if (!res.ok) {
          // Fallback to "Other" but don't throw to avoid "Analysis failed" crash
          console.warn('Analysis API returned error, falling back to Other')
          setFormData(prev => ({ ...prev, category: 'Other' }))
          return
        }
        
        const data = await res.json()
        if (data.category && categories.includes(data.category)) {
          setFormData(prev => ({ ...prev, category: data.category }))
        }

      } catch (err) {
        console.error('AI Image Analysis Error:', err)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const clearMedia = () => {
    setImageFile(null)
    setPreviewUrl(null)
    setAudioBlob(null)
    setAudioExtension('webm')
    setIsRecording(false)
    setIsAnalyzing(false)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  const getSupportedMimeType = () => {
    const types = [
      { mime: 'audio/webm;codecs=opus', ext: 'webm' },
      { mime: 'audio/webm', ext: 'webm' },
      { mime: 'audio/mp4', ext: 'm4a' },
      { mime: 'audio/wav', ext: 'wav' },
    ]
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type.mime)) {
        return type
      }
    }
    return { mime: '', ext: 'webm' }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const supported = getSupportedMimeType()
        const options = supported.mime ? { mimeType: supported.mime } : {}
        
        const mediaRecorder = new MediaRecorder(stream, options)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: supported.mime || 'audio/webm' })
          setAudioBlob(blob)
          setAudioExtension(supported.ext)
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error('Error accessing microphone:', err)
        setError('Microphone access denied or unavailable.')
      }
    }
  }

  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false)
  const [similarComplaint, setSimilarComplaint] = useState<any>(null)
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields')
      return
    }

    // Step 1: Check for duplicates if we have coordinates
    if (formData.latitude && formData.longitude && !showDuplicateAlert) {
      setIsCheckingDuplicate(true)
      try {
        const checkRes = await fetch('/api/complaints/duplicate-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            latitude: formData.latitude,
            longitude: formData.longitude
          }),
        })

        if (checkRes.ok) {
          const checkData = await checkRes.json()
          if (checkData.duplicate && checkData.similarComplaint) {
            setSimilarComplaint(checkData.similarComplaint)
            setShowDuplicateAlert(true)
            setIsCheckingDuplicate(false)
            return // Stop submission to show alert
          }
        }
      } catch (err) {
        console.error('Duplicate check failed:', err)
        // Continue to normal submission if check fails
      } finally {
        setIsCheckingDuplicate(false)
      }
    }

    await handleContinueSubmit()
  }

  const handleContinueSubmit = async () => {
    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('location', formData.location)
      submitData.append('category', formData.category)
      
      if (formData.latitude) submitData.append('latitude', formData.latitude.toString())
      if (formData.longitude) submitData.append('longitude', formData.longitude.toString())
      
      if (imageFile) submitData.append('image', imageFile)
      if (audioBlob) submitData.append('audio', audioBlob, `audio.${audioExtension}`)
      
      // Stop recording if currently active
      if (isRecording) {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
      }

      await onSubmit?.(submitData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        category: categories[0],
        latitude: null,
        longitude: null,
      })
      clearMedia()
      setShowDuplicateAlert(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit complaint')
    }
  }

  const handleVote = async (complaintId: string) => {
    setIsVoting(true)
    try {
      const res = await fetch('/api/complaints/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_id: complaintId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to vote')
      }

      // Briefly wait to show success state in modal before closing
      setTimeout(() => {
        setShowDuplicateAlert(false)
        // Reset form as they "voted" instead of submitting
        setFormData({
          title: '',
          description: '',
          location: '',
          category: categories[0],
          latitude: null,
          longitude: null,
        })
        clearMedia()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voting failed')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Title *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief summary of the problem"
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Category {isAnalyzing && <span className="text-xs text-accent animate-pulse ml-2">(AI analyzing image...)</span>}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-secondary border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Description *
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide details about the problem..."
            className="min-h-24 bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            maxLength={1000}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-foreground">
              Location *
            </label>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-accent hover:text-accent/80 text-xs font-bold gap-1"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? '📍 DETECTING...' : 'USE MY LOCATION 📍'}
            </Button>
          </div>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location or address"
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          {formData.latitude && !isGettingLocation && (
            <p className="text-[10px] text-accent font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="size-1.5 bg-accent rounded-full animate-pulse" />
              Location detected
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageCapture}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant={imageFile ? "default" : "outline"}
              size="sm"
              className={imageFile ? "bg-accent text-accent-foreground gap-2" : "border-border hover:bg-secondary gap-2"}
              disabled={isLoading || isAnalyzing}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing...' : imageFile ? 'Photo Attached' : 'Camera'}
            </Button>
            
            <Button
              type="button"
              variant={isRecording || audioBlob ? "default" : "outline"}
              size="sm"
              className={isRecording ? "bg-destructive text-destructive-foreground gap-2 hover:bg-destructive/90 animate-pulse" : audioBlob ? "bg-accent text-accent-foreground gap-2" : "border-border hover:bg-secondary gap-2"}
              disabled={isLoading || isAnalyzing}
              onClick={toggleRecording}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Stop Recording' : audioBlob ? 'Audio Attached' : 'Audio'}
            </Button>
          </div>

          {/* Image Preview Section */}
          {previewUrl && (
            <div className={`mt-2 relative inline-block group ${isAnalyzing ? 'opacity-50' : ''}`}>
              <img 
                src={previewUrl} 
                alt="Complaint preview" 
                className="w-full max-h-48 object-cover rounded-lg border border-border mt-2"
              />
              {!isAnalyzing && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-2 size-6 rounded-full opacity-80 hover:opacity-100"
                  onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                >
                  <Square className="size-3 fill-current rotate-45" />
                </Button>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg mt-2">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}

          {(imageFile || audioBlob) && (
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>{imageFile ? '1 image ' : ''}{audioBlob ? (imageFile ? '& 1 audio attached' : '1 audio attached') : ''}</span>
              <Button type="button" variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={clearMedia} disabled={isAnalyzing}>Clear Media</Button>
            </div>
          )}
        </div>



        <Button
          type="submit"
          disabled={isLoading || isCheckingDuplicate}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        >
          {isCheckingDuplicate ? 'Scanning for similar issues...' : isLoading ? 'Submitting...' : 'Submit Complaint'}
        </Button>
      </form>

      <DuplicateAlertModal
        isOpen={showDuplicateAlert}
        onClose={() => setShowDuplicateAlert(false)}
        isVoting={isVoting}
        similarComplaint={similarComplaint}
        onVote={handleVote}
        onContinue={handleContinueSubmit}
      />
    </Card>
  )
}
