import { model, models, Schema } from 'mongoose'
import Animaux from '../Types/Animaux'

const animauxSchema = new Schema<Animaux>({
  _id: { type: String, required: true },
  nom: { type: String, required: true },
  espece: { type: String, required: true },
  naissance: { type: String, required: true },
  deces: { type: String, required: true },
  sexe: { type: String, required: true },
  observations: { type: String, required: true },
  position: { type: String, required: true }
})
export default models.AnimalM || model<Animaux>('AnimalM', animauxSchema)
