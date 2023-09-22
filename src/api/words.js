import api from '@/config/api'

export const getAllWords = async () => {
  const { data } = await api.get('/words')
  return data
}

export const getFiltered = async (letters) => {
  const { data } = await api.post('/words/filteredBy', {
    letters
  })
  return data
}