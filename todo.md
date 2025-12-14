# DNA Project - EuroDNA Data Center (Next.js + Supabase)

## Project Setup
- [x] إنشاء مشروع Next.js جديد
- [x] تثبيت Supabase client
- [x] إعداد متغيرات البيئة
- [x] إنشاء Supabase client configuration
- [x] إضافة خط Tajawal

## Supabase Database Schema
- [x] إنشاء جدول candles للشموع
- [x] إنشاء جدول news_events للأخبار
- [x] إنشاء جدول jobs لإدارة المهام
- [x] إنشاء جدول analysis_runs لمنع إعادة التحليل
- [x] إنشاء جدول analysis_results لنتائج التحليل

## Data Center Features
- [x] صفحة Data Center الرئيسية
- [x] عرض Raw Data Status
- [x] نظام رفع الملفات (CSV + JSON)
- [x] Progress Bar للعمليات
- [ ] عرض Ingestion History
- [ ] عرض Analysis Runs

## File Upload System
- [x] رفع ملفات CSV للشموع
- [x] رفع ملف JSON للأخبار
- [x] Incremental Import (إضافة الفترات الزمنية الجديدة فقط)
- [x] منع رفع نفس البيانات مرتين

## Jobs System
- [ ] Jobs Queue Manager
- [ ] منع تداخل Jobs
- [ ] عرض حالة Jobs
- [ ] Job Logs

## Deployment
- [ ] دفع الكود إلى GitHub
- [ ] النشر على Vercel
- [ ] اختبار الموقع المنشور
