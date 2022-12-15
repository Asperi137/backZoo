import { NextApiRequest, NextApiResponse } from 'next'
import User from 'Types/User'
import mongooseConnect from 'lib/mongooseConnect'
import ResponseError from 'Types/ResponseError'
import { login } from 'controllers/user'
import { withSessionRoute } from 'lib/withSession'

mongooseConnect()

export default withSessionRoute(loginRoute)

async function loginRoute (
  req: NextApiRequest,
  res: NextApiResponse<User | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'x-requested-with, Content-Type, origin, authorization, accept, client-security-token'
    )
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'POST') {
      login(req, res)
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  })
}
