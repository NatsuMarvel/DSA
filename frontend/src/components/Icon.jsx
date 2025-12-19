import React from 'react'

export const Code = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.5 17L3 12l5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.5 7L21 12l-5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const YouTube = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.79 4 12 4 12 4s-6.79 0-8.59.46A2.78 2.78 0 001.46 6.42 29.22 29.22 0 000 12a29.22 29.22 0 001.46 5.58 2.78 2.78 0 001.95 1.96C5.21 20 12 20 12 20s6.79 0 8.59-.46a2.78 2.78 0 001.95-1.96A29.22 29.22 0 0024 12a29.22 29.22 0 00-1.46-5.58z" stroke="currentColor" strokeWidth="0.5" fill="currentColor"/>
    <path d="M10 15l5-3-5-3v6z" fill="#fff" />
  </svg>
)

export const Article = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Check = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default { Code, YouTube, Article, Check }
