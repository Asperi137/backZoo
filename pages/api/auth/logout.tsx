import { withSessionRoute } from 'lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'
import User from 'Types/User'
import ResponseError from 'Types/ResponseError'

export default withSessionRoute(logoutRoute)

async function logoutRoute (
  req: NextApiRequest,
  res: NextApiResponse<User | ResponseError>
) {
  return new Promise((resolve, reject) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', ' POST')

    if (req.method === 'POST') {
      req.session.destroy()
      res.send({ login: '', password: '', role: '' })
    } else {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  })
}
