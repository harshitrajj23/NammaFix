import { NextRequest } from 'next/server'
import { mistral } from '@/lib/mistral'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File | null

    if (!image) {
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert image to base64
    const buffer = Buffer.from(await image.arrayBuffer())
    const base64Image = buffer.toString('base64')

    // Call Mistral Vision model as requested
    const response = await mistral.chat.complete({
      model: 'pixtral-12b',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an AI analyzing civic infrastructure images.
Identify the issue shown in the image.
Return ONLY valid JSON in this format:
{
"category": "pothole | garbage | water leakage | broken streetlight | drainage issue | fallen tree | road damage | other"
}
Do not include explanations.`
            },
            {
              type: 'image_url',
              image_url: `data:${image.type};base64,${base64Image}`
            } as any
          ]
        }
      ],
      responseFormat: { type: 'json_object' }
    })

    const text = response.choices?.[0]?.message?.content || "{}"
    console.log("AI response:", text)

    let category = "other"
    try {
      const parsed = JSON.parse(typeof text === 'string' ? text : JSON.stringify(text))
      category = (parsed.category || "other").toLowerCase()
    } catch (e) {
      console.warn("JSON parse failed, falling back to keyword detection")
      category = typeof text === 'string' ? text.toLowerCase() : "other"
    }

    // Fallback keyword detection
    if (category.includes("garbage") || category.includes("trash") || category.includes("waste")) category = "garbage"
    else if (category.includes("pothole") || category.includes("road damage")) category = "pothole"
    else if (category.includes("water") || category.includes("leak") || category.includes("drainage")) category = "water leakage"
    else if (category.includes("light") || category.includes("lamp") || category.includes("streetlight")) category = "broken streetlight"
    else if (category.includes("tree")) category = "fallen tree"
    else if (category.includes("traffic") || category.includes("jam") || category.includes("congestion")) category = "traffic"

    // Map to final UI categories (matching types/constants used in frontend)
    const uiCategories: Record<string, string> = {
      'pothole': 'Pothole',
      'garbage': 'Garbage',
      'water leakage': 'Water Leakage',
      'broken streetlight': 'Street Light',
      'fallen tree': 'Other', 
      'traffic': 'Traffic',
      'other': 'Other'
    }


    // Final mapping check
    let finalCategory = 'Other'
    for (const [key, value] of Object.entries(uiCategories)) {
      if (category.includes(key)) {
        finalCategory = value
        break
      }
    }

    return Response.json({ category: finalCategory })

  } catch (err) {
    console.error('AI Image Analysis Error:', err)
    return Response.json({ category: 'Other' })
  }
}


