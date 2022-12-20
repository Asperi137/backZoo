import { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import Evenements from 'Types/Evenements'
import { agirSurAnimaux } from 'controllers/animaux'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
const API_adr = process.env.API_adr
/**
 * @swagger
 * /api/animaux/sortir:
 *   post:
 *     tags: [Animaux]
 *     parameters:
 *       - in: query
 *         name: animal
 *         required: true
 *         type: string
 *         description: _id de l'animal à sortir
 *       - in: query
 *         name: createur
 *         required: true
 *         type: string
 *       - in: query
 *         name: observations
 *         type: string
 *     description: Creer un evenement de sortir et modifie l'animal pour le mettre dedans
 *     responses:
 *       201:
 *         description: soin ajouté
 *       400:
 *         description: error
 */

export default withSessionRoute(sortir)

async function sortir (
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
        agirSurAnimaux('sortie', req, res)
      } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed ici`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
