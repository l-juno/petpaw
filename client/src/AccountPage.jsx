import {
  Button,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './AccountPage.module.css';
import axios from './api/axios';
import { useState, useEffect } from 'react';
import { IconEdit } from '@tabler/icons-react';
import { useRef } from 'react';
import { DateInput } from '@mantine/dates';

export function AccountPage() {
 
  const [attributesScrolled, setAttributesScrolled] = useState(false); 

  const [pets, setPets] = useState([]);
  const [commentedOnAllUsers, setCommentedOnAllUsers] = useState([]);
  const [postsByPet, setPostsByPet] = useState([]);

  const [editingPetID, setEditingPetID] = useState();

  const petNameRef = useRef(null);
  const petBirthdayRef = useRef(null);
  const petSpeciesRef = useRef(null);


  useEffect(() => {
    getPets();
    getCommentedOnAllUsers();
    getPostsByPet();
  }, []);

  const getPets = () => {
    axios.get(`/pet/${localStorage.getItem('username')}`).then(res => {
      setPets(res.data.data);
    }).catch(err => {
      alert(err);
    });
  }; 

  const getCommentedOnAllUsers = () => {
    axios.get(`/summary/commentedOnAllPosts/${localStorage.getItem('username')}`).then(res => {
      setCommentedOnAllUsers(res.data.data);
    }).catch(err => {
      alert(err);
    });
  }; 

  const getPostsByPet = () => {
    axios.get(`/summary/postsByPetForUser/${localStorage.getItem('username')}`).then(res => {
      setPostsByPet(res.data.data);
    }).catch(err => {
      alert(err);
    });
  }; 

  const updatePet = (pet_id) => {
    axios.put(`/pet/${pet_id}`, {
      name: petNameRef.current.value,
      birthday: petBirthdayRef.current.value,
      species: petSpeciesRef.current.value,
    }).then(() => {
      setEditingPetID(null);
    }).catch(err => {
      alert(err);
    });
  };

  return (
    <Stack gap="xl" pt="xl" pl="xl">
      <Group>
        <Stack>
          <Title>My Pets</Title>
          <ScrollArea
            h={200}
            type="auto"
            onScrollPositionChange={({ y }) => setAttributesScrolled(y !== 0)}
            mt="sm"
            mb="sm"
          >
            <Table className={classes.attributeSelector}>
              <Table.Thead className={`${classes.stickyHeader} ${attributesScrolled ? classes.scrolled : ''}`}>
                <Table.Tr>
                  <Table.Th></Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Birthday</Table.Th>
                  <Table.Th>Species</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pets.map((pet) => (
                  <Table.Tr key={pet.pet_id}>
                    {editingPetID === pet.pet_id ? 
                      <>
                        <Table.Td>
                          <Button onClick={() => updatePet(pet.pet_id)}>
                            Save
                          </Button>
                        </Table.Td>
                        <Table.Td>
                          <TextInput 
                            defaultValue={pet.name}
                            ref={petNameRef}
                          />
                        </Table.Td>
                        <Table.Td>
                          <DateInput
                            defaultValue={new Date(pet.birthday).toLocaleDateString()}
                            ref={petBirthdayRef}
                          />
                        </Table.Td>
                        <Table.Td>
                          <TextInput 
                            defaultValue={pet.species}
                            ref={petSpeciesRef}
                          />
                        </Table.Td>
                      </> : 
                      <>
                        <Table.Td>
                          <div className={classes.editIcon}>
                            <IconEdit
                              onClick={() => setEditingPetID(pet.pet_id)}
                            />
                          </div>
                        </Table.Td>
                        <Table.Td>{pet.name}</Table.Td>
                        <Table.Td>{new Date(pet.birthday).toLocaleDateString()}</Table.Td>
                        <Table.Td>{pet.species}</Table.Td>
                      </>}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Group>
      <Group gap={128} align='flex-start'>
        <Stack>
          <Text>Breakdown of Posts by Pet</Text>
          <ScrollArea
            h={200}
            type="auto"
            onScrollPositionChange={({ y }) => setAttributesScrolled(y !== 0)}
            mt="sm"
            mb="sm"
          >
            <Table className={classes.attributeSelector}>
              <Table.Thead className={`${classes.stickyHeader} ${attributesScrolled ? classes.scrolled : ''}`}>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Count</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {postsByPet.map((post) => (
                  <Table.Tr key={post.pet_id}>
                    <Table.Td>{post.name}</Table.Td>
                    <Table.Td>{post.count}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
        <Stack>
          <Text>Users who have commented on all of my posts</Text>
          <ScrollArea
            h={200}
            type="auto"
            onScrollPositionChange={({ y }) => setAttributesScrolled(y !== 0)}
            mt="sm"
            mb="sm"
          >
            <Table className={classes.attributeSelector}>
              <Table.Thead className={`${classes.stickyHeader} ${attributesScrolled ? classes.scrolled : ''}`}>
                <Table.Tr>
                  <Table.Th>Username</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {commentedOnAllUsers.map((user) => (
                  <Table.Tr key={user.username}>
                    <Table.Td>{user.username}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea> 
        </Stack>
      </Group>
    </Stack>
  );
}