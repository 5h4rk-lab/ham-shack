import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Drill from './pages/Drill'
import Exam from './pages/Exam'
import Lab from './pages/Lab'
import Progress from './pages/Progress'
import Reference from './pages/Reference'
import Credits from './pages/Credits'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="learn" element={<Learn />} />
        <Route path="learn/:id" element={<Learn />} />
        <Route path="drill" element={<Drill />} />
        <Route path="exam" element={<Exam />} />
        <Route path="lab" element={<Lab />} />
        <Route path="lab/:tool" element={<Lab />} />
        <Route path="progress" element={<Progress />} />
        <Route path="ref" element={<Reference />} />
        <Route path="ref/:tab" element={<Reference />} />
        <Route path="credits" element={<Credits />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  </HashRouter>,
)
