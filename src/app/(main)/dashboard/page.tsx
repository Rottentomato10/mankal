'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatCurrency } from '@/utils/format'

interface CategorySummary {
  name: string
  amount: number
  percentage: number
}

interface MonthlyData {
  month: string
  income: number
  expense: number
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategorySummary[]>([])
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyData[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const monthNames = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ']

  const categoryIcons: Record<string, string> = {
    'אוכל': '🍽️', 'תחבורה': '🚌', 'בילויים': '🎉', 'קניות': '🛍️',
    'חשבונות': '📄', 'בריאות': '💊', 'לימודים': '📚', 'אחר': '📦'
  }

  const fetchYearData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/transactions?year=${selectedYear}`)
      const data = await res.json()

      if (data.transactions) {
        // Calculate totals
        let inc = 0, exp = 0
        const categoryTotals: Record<string, number> = {}
        const monthlyMap: Record<number, { income: number; expense: number }> = {}

        // Initialize months
        for (let i = 0; i < 12; i++) {
          monthlyMap[i] = { income: 0, expense: 0 }
        }

        data.transactions.forEach((t: { type: string; amount: number; category?: { name: string }; date: string }) => {
          const month = new Date(t.date).getMonth()

          if (t.type === 'INCOME') {
            inc += t.amount
            monthlyMap[month].income += t.amount
          } else {
            exp += t.amount
            monthlyMap[month].expense += t.amount
            const catName = t.category?.name || 'אחר'
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount
          }
        })

        setTotalIncome(inc)
        setTotalExpenses(exp)

        // Category breakdown
        const breakdown = Object.entries(categoryTotals)
          .map(([name, amount]) => ({
            name,
            amount,
            percentage: exp > 0 ? Math.round((amount / exp) * 100) : 0
          }))
          .sort((a, b) => b.amount - a.amount)
        setCategoryBreakdown(breakdown)

        // Monthly trend
        const trend = Object.entries(monthlyMap).map(([month, data]) => ({
          month: monthNames[parseInt(month)],
          income: data.income,
          expense: data.expense
        }))
        setMonthlyTrend(trend)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [selectedYear])

  useEffect(() => {
    fetchYearData()
  }, [fetchYearData])

  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0

  // Find max value for chart scaling
  const maxMonthlyValue = Math.max(...monthlyTrend.map(m => Math.max(m.income, m.expense)), 1)

  if (isLoading) {
    return (
      <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)', marginTop: '100px' }}>טוען נתונים...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>דשבורד</h1>
        <p style={{ color: 'var(--text-dim)', margin: '4px 0 0', fontSize: '0.9rem' }}>סקירה שנתית</p>
      </div>

      {/* Year Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedYear(y => y - 1)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff' }}
        >
          ←
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.2rem', lineHeight: '36px' }}>{selectedYear}</span>
        <button
          onClick={() => setSelectedYear(y => y + 1)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: '#fff' }}
        >
          →
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: 0 }}>הכנסות</p>
          <p style={{ color: 'var(--income)', fontSize: '1.3rem', fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(totalIncome)}</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: 0 }}>הוצאות</p>
          <p style={{ color: 'var(--expense)', fontSize: '1.3rem', fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: 0 }}>יתרה</p>
          <p style={{ color: balance >= 0 ? 'var(--income)' : 'var(--expense)', fontSize: '1.3rem', fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(balance)}</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: 0 }}>שיעור חיסכון</p>
          <p style={{ color: savingsRate >= 0 ? 'var(--income)' : 'var(--expense)', fontSize: '1.3rem', fontWeight: 700, margin: '4px 0 0' }}>{savingsRate}%</p>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600 }}>מגמה חודשית</h3>
        <div style={{ display: 'flex', gap: '4px', height: '120px', alignItems: 'flex-end' }}>
          {monthlyTrend.map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '2px', height: '80px', alignItems: 'flex-end' }}>
                <div
                  style={{
                    width: '8px',
                    height: `${(m.income / maxMonthlyValue) * 80}px`,
                    background: 'var(--income)',
                    borderRadius: '2px 2px 0 0',
                    minHeight: m.income > 0 ? '4px' : '0'
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: `${(m.expense / maxMonthlyValue) * 80}px`,
                    background: 'var(--expense)',
                    borderRadius: '2px 2px 0 0',
                    minHeight: m.expense > 0 ? '4px' : '0'
                  }}
                />
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{m.month}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--income)', borderRadius: '2px' }} />
            הכנסות
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--expense)', borderRadius: '2px' }} />
            הוצאות
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card">
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600 }}>התפלגות הוצאות</h3>
        {categoryBreakdown.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>אין הוצאות בשנה זו</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{categoryIcons[cat.name] || '📦'}</span>
                    <span style={{ fontSize: '0.9rem' }}>{cat.name}</span>
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {formatCurrency(cat.amount)} ({cat.percentage}%)
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${cat.percentage}%`,
                      background: 'var(--expense)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
