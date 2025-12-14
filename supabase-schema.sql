-- DNA Project - Supabase Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: candles (شموع الأسعار)
CREATE TABLE IF NOT EXISTS candles (
  id BIGSERIAL PRIMARY KEY,
  timeframe VARCHAR(10) NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  open DECIMAL(10, 5) NOT NULL,
  high DECIMAL(10, 5) NOT NULL,
  low DECIMAL(10, 5) NOT NULL,
  close DECIMAL(10, 5) NOT NULL,
  volume BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(timeframe, datetime)
);

CREATE INDEX idx_candles_timeframe_datetime ON candles(timeframe, datetime DESC);
CREATE INDEX idx_candles_datetime ON candles(datetime DESC);

-- Table: news_events (الأخبار الاقتصادية)
CREATE TABLE IF NOT EXISTS news_events (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME,
  year INTEGER,
  currency VARCHAR(10),
  detail TEXT,
  impact VARCHAR(20),
  forecast TEXT,
  previous TEXT,
  actual TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, time, currency, detail)
);

CREATE INDEX idx_news_date ON news_events(date DESC);
CREATE INDEX idx_news_currency ON news_events(currency);
CREATE INDEX idx_news_impact ON news_events(impact);

-- Table: jobs (إدارة المهام)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Table: analysis_runs (سجل التحليلات لمنع التكرار)
CREATE TABLE IF NOT EXISTS analysis_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeframe VARCHAR(10) NOT NULL,
  parameters JSONB NOT NULL,
  dataset_signature VARCHAR(64) NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(timeframe, parameters, dataset_signature)
);

CREATE INDEX idx_analysis_runs_timeframe ON analysis_runs(timeframe);
CREATE INDEX idx_analysis_runs_status ON analysis_runs(status);

-- Table: analysis_results (نتائج التحليلات)
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_run_id UUID REFERENCES analysis_runs(id) ON DELETE CASCADE,
  result_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_results_run_id ON analysis_results(analysis_run_id);
