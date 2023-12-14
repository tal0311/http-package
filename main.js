import { http } from './index.js'
const BASE_URL = '//localhost:3000/api'

loadPosts()
async function loadPosts() {
 try {
  const data = await query(`${BASE_URL}/posts`)
  console.log('data:', data)
 } catch (error) {
  console.log('error:', error)
 }
}


async function query(url) {
 try {
  const data = await http.get(url)
  console.log('data:', data)

 } catch (error) {
  console.log('error from the call:', error)

 }
}




