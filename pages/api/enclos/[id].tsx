import { NextApiRequest, NextApiResponse } from 'next'
import Enclos from 'Types/Enclos'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { deleteEnclos, getOneEnclos, modifyEnclos } from 'controllers/enclos'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
/**
 * @swagger
 * /api/enclos/[id]:
 *   get:
 *     tags: [Enclos]
 *     description: Returns les caracteristique de l'enclos [id]
 *     responses:
 *       200:
 *         description: les caracteristique de l'enclos [id]
 *       404:
 *         description: enclos non trouvé
 */
/**
 * @swagger
 * /api/enclos/[id]:
 *   put:
 *     tags: [Enclos]
 *     description: modifie les caracteriqtique de l'enclos [id]
 *     responses:
 *       202:
 *         description: enclos modifié
 *       400:
 *         description: error
 */
/**
 * @swagger
 * /api/enclos/[id]:
 *   delete:
 *     tags: [Enclos]
 *     description: supprime l'enclos [id]
 *     responses:
 *       410:
 *         description: enclos supprimé
 *       404:
 *         description: error
 */

export default withSessionRoute(ID)

async function ID (
  req: NextApiRequest,
  res: NextApiResponse<Enclos | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE')

    if (req.method === 'GET') {
      getOneEnclos(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'PUT':
          modifyEnclos(req, res)
          break
        case 'DELETE':
          deleteEnclos(req, res)
          break

        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
