import mongo from '../../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const restaurants = await db.collection('restaurants')
  const results = await restaurants.distinct('cuisine')
  res.status(200).json(results)
}