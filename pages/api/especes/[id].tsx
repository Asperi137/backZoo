import { NextApiRequest, NextApiResponse } from 'next'
import Especes from 'Types/Especes'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { deleteEspece, getOneEspece, modifyEspece } from 'controllers/especes'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
/**
 * @swagger
 * /api/especes/[id]:
 *   get:
 *     tags: [Especes]
 *     description: Returns les caracteristique de l'Espece [id]
 *     responses:
 *       200:
 *         description: les caracteristique de l'Espece [id]
 *       404:
 *         description: animal non trouvé
 */
/**
 * @swagger
 * /api/especes/[id]:
 *   put:
 *     tags: [Especes]
 *     description: modifie les caracteriqtique de l'Espece [id]
 *     responses:
 *       202:
 *         description: Espece modifié
 *       400:
 *         description: error
 */
/**
 * @swagger
 * /api/especes/[id]:
 *   delete:
 *     tags: [Especes]
 *     description: supprime l'Espece [id]
 *     responses:
 *       410:
 *         description: Espece supprimé
 *       404:
 *         description: error
 */

export default withSessionRoute(ID)

async function ID (
  req: NextApiRequest,
  res: NextApiResponse<Especes | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    if (req.method === 'GET') {
      getOneEspece(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'PUT':
          modifyEspece(req, res)
          break
        case 'DELETE':
          deleteEspece(req, res)
          break
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
