import mongo from '../../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const neighborhoods = await db.collection('neighborhoods')
  const results = await neighborhoods.find().toArray()
  var arr = []
  for (let i = 0; i < results.length; i++) {
      arr.push(results[i].name)
  }
  res.status(200).json(arr)
}