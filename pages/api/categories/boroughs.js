import mongo from '../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const boroughs = db.collection('boroughs')
  const results = await boroughs.findOne()
  console.log(results)
  res.status(200).json(results)
}
