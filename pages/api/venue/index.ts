import { getAllVenues } from 'services/venueService'

export default async function handle (req, res) {
  const result = await getAllVenues()
  res.json(result)
}
