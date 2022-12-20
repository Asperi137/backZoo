import { NextApiRequest, NextApiResponse } from 'next/types'
import Especes from 'Types/Especes'
import ResponseError from 'Types/ResponseError'
import EspeceM from 'models/especes'
import EvenementsM from 'models/evenements'
import Evenements from 'Types/Evenements'
import Enclos from 'Types/Enclos'
import apiConnect from 'lib/apiConnect'

export function createEspece (
  req: NextApiRequest,
  res: NextApiResponse<Especes[] | Especes | ResponseError>
) {
  const espece = new EspeceM({
    ...req.body
  })
  espece
    .save()
    .then(() => res.status(201).json({ message: 'Espece ajoutée' }))
    .catch((error: ResponseError) => res.status(400).json(error))
}

export function modifyEspece (
  req: NextApiRequest,
  res: NextApiResponse<Especes | ResponseError>
) {
  EspeceM.updateOne({ _id: req.query.id }, { ...req.body, _id: req.query.id })
    .then(() => res.status(202).json({ message: 'Espece modifiée' }))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function deleteEspece (
  req: NextApiRequest,
  res: NextApiResponse<Especes | ResponseError>
) {
  EspeceM.deleteOne({ _id: req.query.id })
    .then(() => res.status(410).json({ message: 'Espece supprimée' }))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function getOneEspece (
  req: NextApiRequest,
  res: NextApiResponse<Especes | ResponseError>
) {
  EspeceM.findOne({ _id: req.query.id })
    .then(espece => res.status(200).json(espece))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function getEspeces (
  req: NextApiRequest,
  res: NextApiResponse<Especes[] | Especes | ResponseError>
) {
  EspeceM.find()
    .then(espece => res.status(200).json(espece))
    .catch((error: ResponseError) => res.status(400).json(error))
}

export async function agirSurEspeces (
  action: string,
  req: NextApiRequest,
  res: NextApiResponse<Evenements | ResponseError>
) {
  let body = req.body
  if (typeof body === 'string') {
    body = JSON.parse(req.body)
  }
  const date = Date.now()

  const espece: Especes = await fetch(
    `${apiConnect()}especes/${body.espece}`
  ).then(res => res.json())

  const enclos: Enclos = await fetch(
    `${apiConnect()}enclos/${espece.enclos}`
  ).then(res => res.json())

  const evenement = new EvenementsM({
    _id: `${date}_${action}_${body.espece}`,
    createur: body.createur,
    type: action,
    espece: body.espece,
    enclos: enclos._id,
    zone: enclos.zone,
    observations: body.observations
  })

  evenement
    .save()
    .then(() => res.status(201).json({ message: `${action} ajoutée` }))
    .catch((error: ResponseError) => res.status(400).json(error))
}
