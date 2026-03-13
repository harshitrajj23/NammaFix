'use client'

import { useState, useRef } from 'react'
import { Mic, Camera, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Complaint } from '@/lib/types'

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
  })
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
    setIsRecording(false)
    setIsAnalyzing(false)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          setAudioBlob(blob)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('location', formData.location)
      submitData.append('category', formData.category)
      
      if (imageFile) submitData.append('image', imageFile)
      if (audioBlob) submitData.append('audio', audioBlob, 'audio.webm')
      
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
      })
      clearMedia()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit complaint')
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
          <label className="block text-sm font-medium text-foreground">
            Location *
          </label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location or address"
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
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
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        >
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </Button>
      </form>
    </Card>
  )
}
