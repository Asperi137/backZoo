import { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import Evenements from 'Types/Evenements'
import { agirSurEnclos } from 'controllers/enclos'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
/**
 * @swagger
 * /api/enclos/verifier:
 *   post:
 *     tags: [Enclos]
 *     parameters:
 *       - in: query
 *         name: enclos
 *         required: true
 *         type: string
 *         description: _id de l'enclos a verifier
 *       - in: query
 *         name: createur
 *         required: true
 *         type: string
 *       - in: query
 *         name: observations
 *         type: string
 *     description: Creer un evenement de verification
 *     responses:
 *       201:
 *         description: verification ajouté
 *       400:
 *         description: error
 */
export default withSessionRoute(verifier)

async function verifier (
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
        agirSurEnclos('verification', req, res)
      } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed ici`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
