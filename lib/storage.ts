const get = (key: string) => {
  return localStorage.getItem(key)
}

const set = (key: string, value: string) => {
  return localStorage.setItem(key, value)
}

const remove = (key: string) => {
  return localStorage.removeItem(key)
}

const removeAll = () => {
  return localStorage.clear()
}

const storage = {
  get,
  set,
  remove,
  removeAll,
}

export default storage
