// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongo from '../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const restaurants = await db.collection('restaurants')

  // filtering 
  const cuisine = req.query.cuisine
  const borough = req.query.borough
  let filter = cuisine ? {cuisine: {$eq: req.query.cuisine}} : {}
  filter = borough ? {borough: {$eq: req.query.borough}} : filter
  filter = (cuisine && borough) ? {cuisine: {$eq: req.query.cuisine}, borough: {$eq: req.query.borough}} : filter

  // sorting
  const order = req.query.sort_by
  const sortOption = order === "grades.asc" ? 1 : -1

  // pagination
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query['page_size'])
  if (page == undefined || isNaN(page)) page = 1
  if (pageSize == undefined || isNaN(pageSize)) pageSize = 10

  const results = await restaurants.find(filter)
    .sort({'grades.0.score' : sortOption, 'name': 1, 'cuisine' : 1, 'borough': 1})
    .skip((page-1) * pageSize)
    .limit(pageSize)
    .toArray()

  res.status(200).json(results)
}