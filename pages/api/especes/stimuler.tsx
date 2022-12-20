import { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import Evenements from 'Types/Evenements'
import { agirSurEspeces } from 'controllers/especes'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
const API_adr = process.env.API_adr
/**
 * @swagger
 * /api/especes/stimuler:
 *   post:
 *     tags: [Especes]
 *     description: Creer un evenement de stimulation
 *     responses:
 *       201:
 *         description: stimulation ajouté
 *       400:
 *         description: error
 */
export default withSessionRoute(stimuler)

async function stimuler (
  req: NextApiRequest,
  res: NextApiResponse<Evenements | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    if (req.session.user) {
      if (req.method === 'POST') {
        agirSurEspeces('stimulation', req, res)
      } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed ici`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
