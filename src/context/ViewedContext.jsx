import React, { createContext, useContext, useEffect, useState } from "react"

const ViewedContext = createContext(null)

export function ViewedProvider({ children }) {
  const [viewed, setViewed] = useState(() => {
    try {
      const raw = localStorage.getItem("viewed")
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("viewed", JSON.stringify(viewed))
  }, [viewed])

  function addViewed(id) {
    setViewed((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 12)
      return next
    })
  }

  return (
    <ViewedContext.Provider value={{ viewed, addViewed }}>
      {children}
    </ViewedContext.Provider>
  )
}

export function useViewed() {
  return useContext(ViewedContext)
}
