import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey, usernamesUniqueKey, usernameKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
  //get score to username from sort set
  const desimalId = await client.zScore(usernameKey(),username)
  //throw error if not found
  if(!desimalId){
    throw new Error('this email not exist')
  }
  //convert id to hex string to be seach in hash 
  const id = desimalId.toString(16)

  //search by id to hash 
  const user = await client.hGetAll(usersKey(id))
  return deSerialize(id,user)
};

export const getUserById = async (id: string) => {
  const user = await client.hGetAll(usersKey(id))
  return deSerialize(id,user);
};

export const createUser = async (attrs:CreateUserAttrs) => {
  const id = genId() 
  //searh in set collection if this uer name in it or no
  const exist  = await client.sIsMember(usernamesUniqueKey(),attrs.username)
  if(exist){
    throw new Error('this user name is exist')
  }
  await client.hSet(usersKey(id), serialize(attrs))
  // save new user name beacuse if any one return signup again
  await client.sAdd(usernamesUniqueKey(),attrs.username)
  //add the username and id in sorte set and convert id form hex string to hex number
  await client.zAdd(usernameKey(),{
    value:attrs.username ,
    score:parseInt(id,16)
  })
  return id;
};

//push data to redis 
const serialize = (user:CreateUserAttrs)=> {
 return{
  username:user.username,
  password:user.password
   }
}

//return hash data from redis . add id 
const deSerialize = (id:string , user:{[key:string]:string})=>{
  return {
    id,
    username:user.username,
    password:user.password
  }
}