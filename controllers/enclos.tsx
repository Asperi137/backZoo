import { NextApiRequest, NextApiResponse } from 'next/types'
import ResponseError from '../Types/ResponseError'
import Enclos from 'Types/Enclos'
import EnclosM from 'models/enclos'
import EvenementsM from 'models/evenements'
import Evenements from 'Types/Evenements'

const API_adr = process.env.API_adr

export function creatEnclos (
  req: NextApiRequest,
  res: NextApiResponse<Enclos[] | Enclos | ResponseError>
) {
  const enclos = new EnclosM({
    ...req.body
  })
  enclos
    .save()
    .then(() => res.status(201).json({ message: 'Enclos ajouté' }))
    .catch((error: ResponseError) => res.status(400).json(error))
}

export function getEnclos (
  req: NextApiRequest,
  res: NextApiResponse<Enclos[] | Enclos | ResponseError>
) {
  EnclosM.find()
    .then(enclos => res.status(200).json(enclos))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function modifyEnclos (
  req: NextApiRequest,
  res: NextApiResponse<Enclos | ResponseError>
) {
  EnclosM.updateOne({ _id: req.query.id }, { ...req.body, _id: req.query.id })
    .then(() => res.status(202).json({ message: 'Enclos modifié' }))
    .catch((error: ResponseError) => res.status(400).json(error))
}

export function deleteEnclos (
  req: NextApiRequest,
  res: NextApiResponse<Enclos | ResponseError>
) {
  EnclosM.deleteOne({ _id: req.query.id })
    .then(() => res.status(410).json({ message: 'Enclos supprimé' }))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function getOneEnclos (
  req: NextApiRequest,
  res: NextApiResponse<Enclos | ResponseError>
) {
  EnclosM.findOne({ _id: req.query.id })
    .then(enclos => res.status(200).json(enclos))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export async function agirSurEnclos (
  action: string,
  req: NextApiRequest,
  res: NextApiResponse<Evenements | ResponseError>
) {
  const date = Date.now()

  const enclos: Enclos = await fetch(
    `${API_adr}enclos/${req.body.enclos}`
  ).then(res => res.json())

  console.log(enclos)

  const evenement = new EvenementsM({
    _id: `${date}_${action}_${req.body.enclos}`,
    createur: req.body.createur,
    type: action,
    enclos: req.body.enclos,
    zone: enclos.zone,
    observations: req.body.observations
  })

  evenement
    .save()
    .then(() => res.status(201).json({ message: `${action} ajoutée` }))
    .catch((error: ResponseError) => res.status(400).json(error))
}
