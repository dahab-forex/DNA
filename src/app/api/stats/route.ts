import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get candles stats
    const { data: candlesData, error: candlesError } = await supabase
      .from('candles')
      .select('timeframe, datetime')

    if (candlesError) throw candlesError

    // Group by timeframe
    const timeframes: Record<string, { count: number; minDate: string; maxDate: string }> = {}
    
    candlesData?.forEach((row) => {
      if (!timeframes[row.timeframe]) {
        timeframes[row.timeframe] = {
          count: 0,
          minDate: row.datetime,
          maxDate: row.datetime,
        }
      }
      timeframes[row.timeframe].count++
      if (row.datetime < timeframes[row.timeframe].minDate) {
        timeframes[row.timeframe].minDate = row.datetime
      }
      if (row.datetime > timeframes[row.timeframe].maxDate) {
        timeframes[row.timeframe].maxDate = row.datetime
      }
    })

    // Get news stats
    const { data: newsData, error: newsError } = await supabase
      .from('news_events')
      .select('date')

    if (newsError) throw newsError

    const newsStats = {
      total: newsData?.length || 0,
      minDate: newsData?.length ? Math.min(...newsData.map(n => new Date(n.date).getTime())) : null,
      maxDate: newsData?.length ? Math.max(...newsData.map(n => new Date(n.date).getTime())) : null,
    }

    // Get jobs stats
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('status')

    if (jobsError) throw jobsError

    const jobsStats = {
      total: jobsData?.length || 0,
      pending: jobsData?.filter(j => j.status === 'pending').length || 0,
      running: jobsData?.filter(j => j.status === 'running').length || 0,
      completed: jobsData?.filter(j => j.status === 'completed').length || 0,
      failed: jobsData?.filter(j => j.status === 'failed').length || 0,
    }

    return NextResponse.json({
      candles: {
        total: candlesData?.length || 0,
        timeframes,
      },
      news: newsStats,
      jobs: jobsStats,
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
