import { NextApiRequest, NextApiResponse } from 'next'
import User from 'Types/User'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { login } from 'controllers/user'
import { withSessionRoute } from 'lib/withSession'
import { hasCookie } from 'cookies-next'

mongooseConnect()

export default withSessionRoute(loginRoute)

async function loginRoute (
  req: NextApiRequest,
  res: NextApiResponse<User | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')

    if (req.method === 'POST') {
      login(req, res)
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  })
}
