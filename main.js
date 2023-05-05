import { http } from './index.js'


// loadPosts()
async function loadPosts() {
 try {
  const data = await query('https://jsonplaceholder.typicode1.com/posts')
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
  return http.retry(3, 2000).then(res => res).catch(console.error)
 }
}




