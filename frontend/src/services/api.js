const API_URL = import.meta.env.VITE_API_URL

// Tokn help

export function getToken() {
  return localStorage.getItem('token')
}

export function getRefreshToken() {
  return localStorage.getItem('refresh')
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token)
  }
}

export function setRefreshToken(refresh) {
  if (refresh) {
    localStorage.setItem('refresh', refresh)
  }
}

export function setTokens(access, refresh) {
  setToken(access)
  setRefreshToken(refresh)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function removeRefreshToken() {
  localStorage.removeItem('refresh')
}

export function removeTokens() {
  removeToken()
  removeRefreshToken()
}


// refresh tokn

async function refreshAccessToken() {
  const refresh = getRefreshToken()

  if (!refresh) {
    removeTokens()
    return null
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    removeTokens()
    return null
  }

  const data = await response.json()

  if (data.access) {
    setToken(data.access)

    if (data.refresh) {
      setRefreshToken(data.refresh)
    }

    return data.access
  }

  removeTokens()
  return null
}


// auth fethc

async function authFetch(url, options = {}) {
  let token = getToken()

  const headers = {
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    const newToken = await refreshAccessToken()

    if (!newToken) {
      throw new Error('Session expired')
    }

    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    })
  }

  return response
}


// AUTH

export async function signup(userData) {
  const response = await fetch(`${API_URL}/users/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  return await response.json()
}

export async function login(userData) {
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (data.access) {
    setToken(data.access)
  }

  if (data.refresh) {
    setRefreshToken(data.refresh)
  }

  return data
}

export function logout() {
  removeTokens()
}


// search

export async function searchAdventures(city) {
  const response = await authFetch(
    `${API_URL}/search/?city=${encodeURIComponent(city)}`
  )

  if (!response.ok) {
    throw new Error('Search failed')
  }

  return await response.json()
}


// crud - saved a

export async function saveAdventure(data) {
  const response = await authFetch(`${API_URL}/saved-adventures/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Save failed')
  }

  return await response.json()
}

export async function getSavedAdventures() {
  const response = await authFetch(`${API_URL}/saved-adventures/`)

  if (!response.ok) {
    throw new Error('Could not load saved adventures')
  }

  return await response.json()
}

export async function getSavedAdventure(id) {
  const response = await authFetch(`${API_URL}/saved-adventures/${id}/`)

  if (!response.ok) {
    throw new Error('Could not load saved adventure')
  }

  return await response.json()
}

export async function updateSavedAdventure(id, data) {
  const response = await authFetch(`${API_URL}/saved-adventures/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Update failed')
  }

  return await response.json()
}

export async function deleteSavedAdventure(id) {
  const response = await authFetch(`${API_URL}/saved-adventures/${id}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Delete failed')
  }

  return true
}