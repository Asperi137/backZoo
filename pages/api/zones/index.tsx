import { NextApiRequest, NextApiResponse } from 'next'
import Zones from 'Types/Zones'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { createZone, getZones } from 'controllers/zones'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()

/**
 * @swagger
 * /api/zones:
 *   get:
 *     tags: [Zones]
 *     description: Returns la list des zones
 *     responses:
 *       200:
 *         description: la list des zones
 *       404:
 *         description: error
 */
/**
 * @swagger
 * /api/zones:
 *   post:
 *     tags: [Zones]
 *     description: Creer un zones [id]
 *     responses:
 *       201:
 *         description: zones ajouté
 *       400:
 *         description: error
 */

export default withSessionRoute(index)

async function index (
  req: NextApiRequest,
  res: NextApiResponse<Zones[] | Zones | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if (req.method === 'GET') {
      getZones(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'POST':
          createZone(req, res)
          break
        default:
          res.setHeader('Allow', ['GET', 'POST'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
