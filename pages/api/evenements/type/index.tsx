import { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { getTypeEvenements } from 'controllers/typeEvenement'
import Type_evenements from 'Types/Type_evenements'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()

export default withSessionRoute(ID)

async function ID (
  req: NextApiRequest,
  res: NextApiResponse<Type_evenements[] | Type_evenements | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET')

    if (req.method === 'GET') {
      getTypeEvenements(req, res)
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  })
}
