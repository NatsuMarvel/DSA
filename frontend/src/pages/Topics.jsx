import React, { useEffect, useState, useRef } from 'react'
import { authClient } from '../api'
import { Code, YouTube, Article } from '../components/Icon' 

export default function Topics(){
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)

  function getYouTubeId(url){
    try{
      const u = new URL(url)
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
      if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
      return null
    }catch{ return null }
  }

  useEffect(() => {
    // initial (visible) load — allow auto-seed on first non-silent load
    load(false)
  }, [])

  // background polling and focus/visibility-based refresh
  useEffect(() => {
    const onVisible = () => { load(true) }
    const onVisibilityChange = () => { if (document.visibilityState === 'visible') onVisible() }

    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisibilityChange)

    const id = setInterval(() => { load(true) }, 30000) // every 30s
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const isFetchingRef = useRef(false)

  // load(silent=false) — silent true avoids UI loading state and prevents auto-seed
  async function load(silent = false){
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    try {
      if (!silent) setLoading(true)
      const client = authClient()
      const res = await client.get('/topics')

      // If no topics exist, auto-populate sample data in development (only on non-silent load)
      if (!res.data || res.data.length === 0) {
        // don't auto-seed in production
        if (import.meta.env.PROD) {
          if (!silent) setTopics([])
          return
        }

        // on silent/background reloads don't attempt seeding
        if (silent) {
          setTopics([])
          return
        }

        // ensure we only attempt auto-seed once per browser session
        const seedFlag = 'dsa_auto_seed_attempted'
        if (sessionStorage.getItem(seedFlag)) {
          setTopics([])
          return
        }

        try {
          await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/seed', { method: 'POST' })
          sessionStorage.setItem(seedFlag, '1')
          const seeded = await client.get('/topics')
          setTopics(seeded.data)
          return
        } catch (seedErr) {
          console.error('Auto-seed failed', seedErr)
          sessionStorage.setItem(seedFlag, '1')
          setTopics([])
          return
        }
      }

      setTopics(res.data)
    } catch (err) {
      console.error(err)
      if (!silent) alert('Failed to load topics. Make sure you are logged in and backend is running.')
    } finally { if (!silent) setLoading(false); isFetchingRef.current = false }
  }

  // Toggle and optimistic update
  async function toggle(problemId, current){
    const token = localStorage.getItem('token')
    if (!token){
      alert('Please login to save progress')
      window.location.href = '/login'
      return
    }

    // optimistic UI update for instant feedback
    setTopics(prev => prev.map(t => ({
      ...t,
      problems: t.problems.map(p => p._id === problemId ? { ...p, completed: !current } : p)
    })))
    try {
      const client = authClient()
      console.log('Sending toggle POST to /topics/progress/toggle', { problemId, completed: !current })
      const res = await client.post('/topics/progress/toggle', { problemId, completed: !current })
      console.log('Toggle response', res.status, res.data)
      // res.data.progress is user's full progress array; sync UI from server state
      if (res?.data?.progress) {
        const progressSet = new Map(res.data.progress.map(p => [p.problemId.toString(), !!p.completed]))
        setTopics(prev => prev.map(t => ({
          ...t,
          problems: t.problems.map(p => ({ ...p, completed: !!progressSet.get(p._id.toString()) }))
        })))
        // brief success acknowledgment
        // console.debug('Progress updated from server')
      } else {
        // fallback: reload topics
        load()
      }
    } catch (err) {
      console.error('Toggle failed, reloading', err.response || err)
      const serverMessage = err?.response?.data?.error || err?.response?.statusText || err.message
      if (err?.response?.status === 401 || err?.response?.data?.error === 'User not found'){
        alert('Session expired or user missing on server. Please login or register again.')
        localStorage.removeItem('token')
        window.location.href = '/login'
        return
      }
      alert('Failed to save progress: ' + serverMessage + '. Re-syncing data from server.')
      load()
    }
  }

  if (loading) return <div style={{padding:20}}>Loading...</div>

  const totalProblems = topics.reduce((s, t) => s + (t.problems?.length || 0), 0)
  const totalCompleted = topics.reduce((s, t) => s + (t.problems?.filter(p => p.completed).length || 0), 0)
  const overallPct = totalProblems ? Math.round((totalCompleted / totalProblems) * 100) : 0

  async function seedSample(){
    try {
      await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/seed', { method: 'POST' })
      load()
    } catch (err){
      alert('Failed to seed: ' + err.message)
    }
  }

  return (
    <div className="page">
      <div className="container">
      <div className="top-summary">
        <div>
          <h2>Topics</h2>
          <div style={{color: 'var(--muted)', fontSize: 14}}>Total problems: {totalProblems} · Completed: {totalCompleted}</div>
        </div>
        <div className="progress-wrap">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{minWidth:48, fontWeight:700}}>{overallPct}%</div>
            <div style={{flex:1}}>
              <div className="progress"><div className="progress-bar" style={{width: `${overallPct}%`}} /></div>
            </div>
          </div>
        </div>
      </div>

      {topics.length === 0 && (
        <div className="card" style={{textAlign:'center'}}>
          <div style={{marginBottom:12}}>No topics found.</div>
          <div style={{display:'flex', justifyContent:'center', gap:12}}>
            <button className="btn" onClick={seedSample}>Populate sample data</button>
          </div>
        </div>
      )}

      {topics.map(t => {
        const completedCount = t.problems.filter(p => p.completed).length
        const pct = t.problems.length ? Math.round((completedCount / t.problems.length) * 100) : 0
        return (
          <div key={t._id} className={`card ${pct === 100 ? 'completed' : ''}`}>
            <div className="card-header">
              <div>
                <h3>{t.title}</h3>
                {t.description && <div className="card-desc">{t.description}</div>}
              </div>
              <div className="meta">
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  {t.youtubeLink && <a className="link-btn" href={t.youtubeLink} target="_blank" rel="noopener noreferrer"><YouTube className="icon"/>Tutorial</a>}
                  <div className="topic-meta">{t.problems.length} problems · {pct}%</div>
                </div>
                {pct === 100 && <span className="check-badge">Completed</span>}
              </div>
            </div>

            <ul>
              {t.problems.map(p => (
                <li key={p._id} className={`problem ${p.completed ? 'completed' : ''}`}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                      <div className="title-row">
                        <strong>{p.title}</strong>
                        <span className={`badge ${p.level?.toLowerCase()}`}>{p.level}</span>
                      </div>
                      <div className="problem-links">
                        {p.leetCodeLink && <a className="link-btn" href={p.leetCodeLink} target="_blank" rel="noopener noreferrer"><Code className="icon"/>LeetCode</a>}
                        {p.youtubeLink && <a className="link-btn" href={p.youtubeLink} target="_blank" rel="noopener noreferrer"><YouTube className="icon"/>YouTube</a>}
                        {p.articleLink && <a className="link-btn" href={p.articleLink} target="_blank" rel="noopener noreferrer"><Article className="icon"/>Article</a>}
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center'}}>
                      <label className="checkbox-label" style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer'}}>
                        <input
                          type="checkbox"
                          className="todo-checkbox"
                          checked={!!p.completed}
                          onChange={() => toggle(p._id, !!p.completed)}
                        />
                        <span className="checkbox-text">{p.completed ? 'Completed' : 'Mark as completed'}</span>
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

          </div>
        )
      })}
    </div>
    </div>
  )
}
