import { NextApiRequest, NextApiResponse } from 'next'
import Animaux from 'Types/Animaux'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { createAnimal, getAnimaux } from 'controllers/animaux'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
/**
 * @swagger
 * /api/animaux:
 *   get:
 *     tags: [Animaux]
 *     description: Returns la list des animaux
 *     responses:
 *       200:
 *         description: la list des animaux
 *       404:
 *         description: error
 */
/**
 * @swagger
 * /api/animaux:
 *   post:
 *     tags: [Animaux]
 *     description: Creer un animal [id]
 *     responses:
 *       201:
 *         description: Animal ajouté
 *       400:
 *         description: error
 */

export default withSessionRoute(index)

async function index (
  req: NextApiRequest,
  res: NextApiResponse<Animaux[] | Animaux | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if (req.method === 'GET') {
      getAnimaux(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'POST':
          createAnimal(req, res)
          break
        default:
          res.setHeader('Allow', ['GET', 'POST'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
