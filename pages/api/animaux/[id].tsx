import { NextApiRequest, NextApiResponse } from 'next'
import Animaux from 'Types/Animaux'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { deleteAnimal, getOneAnimal, modifyAnimal } from 'controllers/animaux'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()

/**
 * @swagger
 * /api/animaux/[id]:
 *   get:
 *     tags: [Animaux]
 *     description: Returns les caracteristique de l'animal [id]
 *     responses:
 *       200:
 *         description: les caracteristique de l'animal [id]
 *       404:
 *         description: animal non trouvé
 */
/**
 * @swagger
 * /api/animaux/[id]:
 *   put:
 *     tags: [Animaux]
 *     description: modifie les caracteriqtique de l'animal [id]
 *     responses:
 *       202:
 *         description: Animal modifié
 *       400:
 *         description: error
 */
/**
 * @swagger
 * /api/animaux/[id]:
 *   delete:
 *     tags: [Animaux]
 *     description: supprime l'animal [id]
 *     responses:
 *       410:
 *         description: Animal supprimé
 *       404:
 *         description: error
 *
 */
export default withSessionRoute(ID)

async function ID (
  req: NextApiRequest,
  res: NextApiResponse<Animaux | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    if (req.method === 'GET') {
      getOneAnimal(req, res)
    } else if (req.session.user) {
      switch (req.method) {
        case 'PUT':
          modifyAnimal(req, res)
          break
        case 'DELETE':
          deleteAnimal(req, res)
          break
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    } else res.status(401).end(`Utilisateur non autorisé`)
  })
}
