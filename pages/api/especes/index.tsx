import { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import Especes from 'Types/Especes'
import { createEspece, getEspeces } from 'controllers/especes'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
/**
 * @swagger
 * /api/especes:
 *   get:
 *     tags: [Especes]
 *     description: Returns la list des especes
 *     responses:
 *       200:
 *         description: la list des especes
 *       404:
 *         description: error
 */
/**
 * @swagger
 * /api/especes:
 *   post:
 *     tags: [Especes]
 *     description: Creer un especes [id]
 *     responses:
 *       201:
 *         description: especes ajouté
 *       400:
 *         description: error
 */

export default withSessionRoute(index)

async function index (
  req: NextApiRequest,
  res: NextApiResponse<Especes[] | Especes | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if (req.method === 'GET') {
      getEspeces(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'POST':
          createEspece(req, res)
          break
        default:
          res.setHeader('Allow', ['GET', 'POST'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
