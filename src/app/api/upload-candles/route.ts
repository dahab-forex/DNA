import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const timeframe = formData.get('timeframe') as string

    if (!file || !timeframe) {
      return NextResponse.json(
        { error: 'File and timeframe are required' },
        { status: 400 }
      )
    }

    const text = await file.text()
    
    // Parse CSV
    const { data } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    const candles = data.map((row: any) => ({
      timeframe,
      datetime: row.DateTime,
      open: parseFloat(row.Open),
      high: parseFloat(row.High),
      low: parseFloat(row.Low),
      close: parseFloat(row.Close),
      volume: parseInt(row.Volume || '0'),
    }))

    // Insert in batches to avoid timeouts
    const batchSize = 1000
    let inserted = 0
    let skipped = 0

    for (let i = 0; i < candles.length; i += batchSize) {
      const batch = candles.slice(i, i + batchSize)
      
      const { data: result, error } = await supabaseAdmin
        .from('candles')
        .upsert(batch, { 
          onConflict: 'timeframe,datetime',
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
      total: candles.length,
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
