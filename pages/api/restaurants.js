// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongo from '../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const restaurants = await db.collection('restaurants')

  // filtering 
  const cuisineInput = req.query.cuisine
  const boroughInput = req.query.borough
  let filter = {}
  cuisineInput ? Object.assign(filter, {cuisine: {$eq: cuisineInput}}) : {}
  boroughInput ? Object.assign(filter, {borough: {$eq: boroughInput}}) : {}

  // sorting
  const order = req.query.sort_by
  const sortOption = order === "grades.asc" ? 1 : -1

  // pagination
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query['page_size'])
  if (page == undefined || isNaN(page)) page = 1
  if (pageSize == undefined || isNaN(pageSize)) pageSize = 10

  // extension 1 - geometry of neighborhood
  const neighborhood = req.query.neighborhood
  const neighborhoods = await db.collection('neighborhoods')
  const nbhd = await neighborhoods.find({name: neighborhood}).toArray()
  neighborhood ? Object.assign(filter, { 'address.coord' : { $geoWithin: { $geometry: { type: 'Polygon', coordinates: [nbhd[0].geometry.coordinates[0]] } } } }) : {}


  const results = await restaurants.find(filter)
    .sort({'grades.0.score' : sortOption, 'name': 1, 'cuisine' : 1, 'borough': 1})
    .skip((page-1) * pageSize)
    .limit(pageSize)
    .toArray()

  res.status(200).json(results)
}