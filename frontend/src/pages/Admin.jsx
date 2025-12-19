import React, { useEffect, useState } from 'react'
import { authClient } from '../api'
import { Code, YouTube, Article } from '../components/Icon' 

export default function Admin(){
  const [topics, setTopics] = useState([])
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [topicForm, setTopicForm] = useState({ title:'', description:'', youtubeLink: '' })
  const [probForm, setProbForm] = useState({ title:'', leetCodeLink:'', youtubeLink:'', articleLink:'', level:'Easy', topicId: '' })
  const [probError, setProbError] = useState(null)
  const [editError, setEditError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ leetCodeLink:'', youtubeLink:'', articleLink:'' })

  useEffect(() => { load() }, [])

  function startEdit(p){
    setEditingId(p._id)
    setEditForm({ leetCodeLink: p.leetCodeLink || '', youtubeLink: p.youtubeLink || '', articleLink: p.articleLink || '' })
    setEditError(null)
  }

  function cancelEdit(){ setEditingId(null); setEditForm({ leetCodeLink:'', youtubeLink:'', articleLink:'' }); setEditError(null) }

  function isValidUrl(str){ if (!str) return true; try { new URL(str); return true } catch { return false } }

  function getYouTubeId(url){ try {
      const u = new URL(url)
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
      if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
      return null
    } catch { return null }
  }

  async function saveEdit(id){
    // validate editForm
    if (editForm.leetCodeLink && !isValidUrl(editForm.leetCodeLink)){ setEditError('Invalid LeetCode URL'); return }
    if (editForm.youtubeLink && !isValidUrl(editForm.youtubeLink)){ setEditError('Invalid YouTube URL'); return }
    if (editForm.articleLink && !isValidUrl(editForm.articleLink)){ setEditError('Invalid Article URL'); return }
    await updateProblem(id, editForm)
    cancelEdit()
  }

  async function load(){
    setLoading(true)
    try {
      const c = authClient()
      const res = await c.get('/topics')
      setTopics(res.data)
      // fetch problems separately
      const res2 = await c.get('/topics')
      const all = res2.data.flatMap(t => t.problems)
      setProblems(all)
    } catch (err) { console.error(err); alert('Failed to load admin data') }
    finally { setLoading(false) }
  }

  async function createTopic(e){
    e.preventDefault()
    try {
      if (topicForm.youtubeLink && !isValidUrl(topicForm.youtubeLink)) { alert('Invalid YouTube URL'); return }
      const c = authClient()
      await c.post('/admin/topics', topicForm)
      setTopicForm({ title:'', description:'', youtubeLink: '' })
      load()
    } catch (err){ alert('Failed to create topic') }
  }

  async function createProblem(e){
    e.preventDefault()
    setProbError(null)

    if (!probForm.title) { setProbError('Title is required'); return }
    if (probForm.leetCodeLink && !isValidUrl(probForm.leetCodeLink)){ setProbError('Invalid LeetCode URL'); return }
    if (probForm.youtubeLink && !isValidUrl(probForm.youtubeLink)){ setProbError('Invalid YouTube URL'); return }
    if (probForm.articleLink && !isValidUrl(probForm.articleLink)){ setProbError('Invalid Article URL'); return }

    try {
      const c = authClient()
      await c.post('/admin/problems', probForm)
      setProbForm({ title:'', leetCodeLink:'', youtubeLink:'', articleLink:'', level:'Easy', topicId: '' })
      load()
    } catch (err){ console.error(err); setProbError(err?.response?.data?.error || 'Failed to create problem') }
  }

  async function updateProblem(id, data){
    try {
      await authClient().put('/admin/problems/' + id, data)
      load()
    } catch (err){ console.error(err); alert('Failed to update problem') }
  }

  async function delTopic(id){ if (!confirm('Delete topic?')) return; await authClient().delete('/admin/topics/'+id); load() }
  async function delProblem(id){ if (!confirm('Delete problem?')) return; await authClient().delete('/admin/problems/'+id); load() }

  if (loading) return <div style={{padding:20}}>Loading admin...</div>

  return (
    <div className="page">
      <div className="container">
      <div className="card">
        <h3>Topics</h3>
        <form onSubmit={createTopic} style={{display:'flex', gap:12, alignItems:'center'}}>
          <input placeholder="Title" value={topicForm.title} onChange={e => setTopicForm({...topicForm, title: e.target.value})} />
          <input placeholder="YouTube link (optional)" value={topicForm.youtubeLink} onChange={e => setTopicForm({...topicForm, youtubeLink: e.target.value})} />
          <button className="btn">Create</button>
        </form>
        <div style={{marginTop:12}}>
          {topics.map(t => (
            <div key={t._id} style={{display:'flex', justifyContent:'space-between', padding:8, borderBottom:'1px solid #f0f0f0'}}>
              <div>
                <div style={{fontWeight:700}}>{t.title}</div>
                {t.youtubeLink && <div style={{marginTop:6}}><a className="link-btn" href={t.youtubeLink} target="_blank" rel="noopener noreferrer"><YouTube className="icon"/>Tutorial</a></div>}
              </div>
              <div>
                <button className="btn btn-ghost" onClick={() => delTopic(t._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Problems</h3>
        <form onSubmit={createProblem} style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
          <input placeholder="Title" value={probForm.title} onChange={e => setProbForm({...probForm, title: e.target.value})} />
          <input placeholder="LeetCode link" value={probForm.leetCodeLink} onChange={e => setProbForm({...probForm, leetCodeLink: e.target.value})} />
          <input placeholder="YouTube link" value={probForm.youtubeLink} onChange={e => setProbForm({...probForm, youtubeLink: e.target.value})} />
          <input placeholder="Article link" value={probForm.articleLink} onChange={e => setProbForm({...probForm, articleLink: e.target.value})} />
          <select value={probForm.level} onChange={e => setProbForm({...probForm, level:e.target.value})}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select value={probForm.topicId} onChange={e => setProbForm({...probForm, topicId:e.target.value})}>
            <option value="">(no topic)</option>
            {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
          </select>
          <button className="btn">Create</button>
        </form>
        {probError && <div className="alert-error" style={{marginTop:8}}>{probError}</div>}

        <div style={{marginTop:12}}>
          {problems.map(p => (
            <div key={p._id} style={{padding:8, borderBottom:'1px solid #f0f0f0'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{p.title} <small style={{color:'#666'}}>({p.level})</small></div>
                    <div style={{marginTop:6}}>
                      {p.leetCodeLink && <a className="link-btn" href={p.leetCodeLink} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} on LeetCode`}><Code className="icon" aria-hidden="true"/>LeetCode</a>}
                      {p.youtubeLink && <a className="link-btn" href={p.youtubeLink} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} on YouTube`}><YouTube className="icon" aria-hidden="true"/>YouTube</a>}
                      {p.articleLink && <a className="link-btn" href={p.articleLink} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} article`}><Article className="icon" aria-hidden="true"/>Article</a>} 
                    </div>
                  </div>
                  {p.youtubeLink && (() => {
                    const id = getYouTubeId(p.youtubeLink)
                    return id ? <img className="yt-thumb" src={`https://img.youtube.com/vi/${id}/0.jpg`} alt="YouTube thumbnail" /> : null
                  })()}
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn btn-ghost" aria-label={`Edit ${p.title}`} onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn btn-ghost" aria-label={`Delete ${p.title}`} onClick={() => delProblem(p._id)}>Delete</button>
                </div>
              </div>

              {editingId === p._id && (
                <div style={{marginTop:8}}>
                  <input placeholder="LeetCode" value={editForm.leetCodeLink} onChange={e => setEditForm({...editForm, leetCodeLink:e.target.value})} />
                  <input placeholder="YouTube" value={editForm.youtubeLink} onChange={e => setEditForm({...editForm, youtubeLink:e.target.value})} />
                  <input placeholder="Article" value={editForm.articleLink} onChange={e => setEditForm({...editForm, articleLink:e.target.value})} />
                  {editError && <div className="alert-error" style={{marginTop:8}}>{editError}</div>}
                  <div style={{marginTop:6}}>
                    <button className="btn" onClick={() => saveEdit(p._id)}>Save</button>
                    <button className="btn btn-ghost" onClick={() => cancelEdit()}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}