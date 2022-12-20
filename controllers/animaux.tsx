import { NextApiRequest, NextApiResponse } from 'next/types'
import ResponseError from 'Types/ResponseError'
import Animaux from 'Types/Animaux'
import AnimalM from 'models/animaux'
import Evenements from 'Types/Evenements'
import EvenementsM from 'models/evenements'
import Especes from 'Types/Especes'
import Enclos from 'Types/Enclos'
import apiConnect from 'lib/apiConnect'

export function createAnimal (
  req: NextApiRequest,
  res: NextApiResponse<Animaux[] | Animaux | ResponseError>
) {
  const animal = new AnimalM({
    ...req.body
  })
  animal
    .save()
    .then(() => res.status(201).json({ message: 'Animal ajouté' }))
    .catch((error: ResponseError) => res.status(400).json(error))
}

export function modifyAnimal (
  req: NextApiRequest,
  res: NextApiResponse<Animaux | ResponseError>
) {
  AnimalM.updateOne({ _id: req.query.id }, { ...req.body, _id: req.query.id })
    .then(() => res.status(202).json({ message: 'Animal modifié' }))
    .catch((error: ResponseError) => res.status(400).json(error))
}

export function deleteAnimal (
  req: NextApiRequest,
  res: NextApiResponse<Animaux | ResponseError>
) {
  AnimalM.deleteOne({ _id: req.query.id })
    .then(() => res.status(410).json({ message: 'Animal supprimé' }))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function getOneAnimal (
  req: NextApiRequest,
  res: NextApiResponse<Animaux | ResponseError>
) {
  AnimalM.findOne({ _id: req.query.id })
    .then(animal => res.status(200).json(animal))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export function getAnimaux (
  req: NextApiRequest,
  res: NextApiResponse<Animaux[] | Animaux | ResponseError>
) {
  AnimalM.find()
    .then(animal => res.status(200).json(animal))
    .catch((error: ResponseError) => res.status(404).json(error))
}

export async function agirSurAnimaux (
  action: string,
  req: NextApiRequest,
  res: NextApiResponse<Evenements | ResponseError>
) {
  let body = req.body
  if (typeof body === 'string') {
    body = JSON.parse(req.body)
  }

  const date = Date.now()

  const animal: Animaux = await fetch(
    `${apiConnect()}animaux/${body.animal}`
  ).then(res => res.json())

  const espece: Especes = await fetch(
    `${apiConnect()}especes/${animal.espece}`
  ).then(res => res.json())

  const enclos: Enclos = await fetch(
    `${apiConnect()}enclos/${espece.enclos}`
  ).then(res => res.json())

  const evenement = new EvenementsM({
    _id: `${date}_${action}_${body.espece}`,
    createur: body.createur,
    type: action,
    animal: body.animal,
    espece: espece._id,
    enclos: enclos._id,
    zone: enclos.zone,
    observations: body.observations
  })

  let updated: boolean = false
  if (action === 'entre' && animal.position !== 'dedans') {
    AnimalM.updateOne({ _id: animal._id }, { position: 'dedans' }).then(() => {
      evenement
        .save()
        .then(() => res.status(201).json({ message: `${action} ajoutée` }))
        .catch((error: ResponseError) => res.status(400).json(error))
    })
  } else if (action === 'sortie' && animal.position !== 'dehors') {
    AnimalM.updateOne({ _id: animal._id }, { position: 'dehors' }).then(() => {
      evenement
        .save()
        .then(() => res.status(201).json({ message: `${action} ajoutée` }))
        .catch((error: ResponseError) => res.status(400).json(error))
    })
  } else {
    evenement
      .save()
      .then(() => res.status(201).json({ message: `${action} ajoutée` }))
      .catch((error: ResponseError) => res.status(400).json(error))
  }
}
