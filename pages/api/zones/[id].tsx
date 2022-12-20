import { NextApiRequest, NextApiResponse } from 'next'
import Zones from 'Types/Zones'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { deleteZone, getOneZone, modifyZone } from 'controllers/zones'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()

/**
 * @swagger
 * /api/zones/[id]:
 *   get:
 *     tags: [Zones]
 *     description: Returns les caracteristique de l'zones [id]
 *     responses:
 *       200:
 *         description: les caracteristique de l'zones [id]
 *       404:
 *         description: zones non trouvé
 */
/**
 * @swagger
 * /api/zones/[id]:
 *   put:
 *     tags: [Zones]
 *     description: modifie les caracteriqtique de l'zones [id]
 *     responses:
 *       202:
 *         description: zones modifié
 *       400:
 *         description: error
 */
/**
 * @swagger
 * /api/zones/[id]:
 *   delete:
 *     tags: [Zones]
 *     description: supprime l'zones [id]
 *     responses:
 *       410:
 *         description: zones supprimé
 *       404:
 *         description: error
 */

export default withSessionRoute(ID)

async function ID (
  req: NextApiRequest,
  res: NextApiResponse<Zones | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    if (req.method === 'GET') {
      getOneZone(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'PUT':
          modifyZone(req, res)
          break
        case 'DELETE':
          deleteZone(req, res)
          break

        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
