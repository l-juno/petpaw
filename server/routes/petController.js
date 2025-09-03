import express from 'express';
import { getPetsByUser, updatePetsByPetID } from './petService.js';

const petRouter = express.Router();

petRouter.get('/:username', async (req, res) => {
  const username = req.params.username;
  // const tableContent = await getPetsByUser(username);
  // res.json({data: tableContent});
  res.json({
    "data": [
        {
            "pet_id": 1,
            "name": "Buddy",
            "birthday": "2018-03-15T07:00:00.000Z",
            "species": "Dog"
        }
    ]
})
});

petRouter.put('/:pet_id', async (req, res) => {
  const pet_id = req.params.pet_id;
  const name = req.body.name
  const birthday = new Date(req.body.birthday)
  const species = req.body.species
  const success = await updatePetsByPetID(pet_id, name, birthday, species);

  if (success) {
    return res.sendStatus(204);
  } else {
    return res.status(500).json({ message: 'Failed to update pet' });
  } 
});

export default petRouter;