import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

const saltRounds = 10
const myPlaintextPassword = '48$Rty63@eD96.'
const some = bcrypt.hashSync(myPlaintextPassword, saltRounds)

let ids = []

for (let i = 0; i < 20; i++) {
  ids.push(nanoid(7))
}

console.log(ids)
