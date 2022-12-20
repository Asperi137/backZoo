import { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { getEventsCible } from 'controllers/eventCondition'
import Evenements from 'Types/Evenements'
import { withSessionRoute } from 'lib/withSession'
import appMobileConnect from 'lib/appMobileConnect'

mongooseConnect()
export default withSessionRoute(ID)

async function ID (
  req: NextApiRequest,
  res: NextApiResponse<Evenements[] | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', appMobileConnect())
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if (req.method === 'GET') {
      getEventsCible('animal', req, res)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  })
}
