import { NextApiRequest, NextApiResponse } from 'next/types'
import bcrypt from 'bcrypt'
import ResponseError from 'Types/ResponseError'
import User from 'Types/User'
import UserM from 'models/user'
import { getCookies, hasCookie } from 'cookies-next'

export async function signup (
  req: NextApiRequest,
  res: NextApiResponse<User | ResponseError>
) {
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new UserM({
        login: req.body.login,
        password: hash,
        role: req.body.role
      })
      user
        .save()
        .then(() => res.status(201).json({ message: 'user créé ' }))
        .catch((error: ResponseError) => res.status(400).json(error))
    })
    .catch((error: ResponseError) => res.status(500).json(error))
}

export async function login (
  req: NextApiRequest,
  res: NextApiResponse<User | ResponseError | any>
) {
  let body = req.body
  if (typeof body === 'string') {
    body = JSON.parse(req.body)
  }

  UserM.findOne({ login: body.login })
    .then(user => {
      if (user === null) {
        res.status(401).json({ message: 'login/password incorrecte' })
        console.log(user)
      } else {
        bcrypt
          .compare(body.password, user.password)
          .then(async valid => {
            if (!valid) {
              res.status(401).json({ message: 'login/password incorrecte' })
            } else {
              req.session.user = {
                login: user.login,
                password: '',
                role: user.role
              }
              await req.session.save()

              res.status(200).json({
                login: user.login,
                role: user.role
              })
            }
          })
          .catch((error: ResponseError) => res.status(500).json(error))
      }
    })
    .catch((error: ResponseError) => res.status(500).end(error))

  return res
}
