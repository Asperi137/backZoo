import { NextApiRequest, NextApiResponse } from 'next'
import Enclos from 'Types/Enclos'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { creatEnclos, getEnclos } from 'controllers/enclos'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
/**
 * @swagger
 * /api/enclos:
 *   get:
 *     tags: [Enclos]
 *     description: Returns la list des enclos
 *     responses:
 *       200:
 *         description: la list des enclos
 *       404:
 *         description: error
 */
/**
 * @swagger
 * /api/enclos:
 *   post:
 *     tags: [Enclos]
 *     description: Creer un enclos [id]
 *     responses:
 *       201:
 *         description: enclos ajouté
 *       400:
 *         description: error
 */

export default withSessionRoute(index)

async function index (
  req: NextApiRequest,
  res: NextApiResponse<Enclos[] | Enclos | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if (req.method === 'GET') {
      getEnclos(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'POST':
          creatEnclos(req, res)
          break
        default:
          res.setHeader('Allow', ['GET', 'POST'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
