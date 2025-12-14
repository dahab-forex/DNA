import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const newsData = JSON.parse(text)

    const newsEvents = newsData.map((item: any) => ({
      date: item.date,
      time: item.time || null,
      year: item.year ? parseInt(item.year) : null,
      currency: item.currency || null,
      detail: item.detail || null,
      impact: item.impact || null,
      forecast: item.forecast || null,
      previous: item.previous || null,
      actual: item.actual || null,
    }))

    // Insert in batches
    const batchSize = 1000
    let inserted = 0
    let skipped = 0

    for (let i = 0; i < newsEvents.length; i += batchSize) {
      const batch = newsEvents.slice(i, i + batchSize)
      
      const { data: result, error } = await supabaseAdmin
        .from('news_events')
        .upsert(batch, { 
          onConflict: 'date,time,currency,detail',
          ignoreDuplicates: true 
        })
        .select()

      if (error) {
        console.error('Batch insert error:', error)
        skipped += batch.length
      } else {
        inserted += result?.length || 0
      }
    }

    return NextResponse.json({
      success: true,
      total: newsEvents.length,
      inserted,
      skipped,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
