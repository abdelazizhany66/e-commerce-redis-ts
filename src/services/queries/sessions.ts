import { client } from '$services/redis';
import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';

export const getSession = async (id: string) => {
  const session = await client.hGetAll(sessionsKey(id))
  if(Object.keys(session).length === 0){
    return null
  }
  return deSerialize (id,session)
};

export const saveSession = async (session: Session) => {
  return await client.hSet(session.id,serialize(session))
  
};


const deSerialize = (id:string, session:{[key:string]:string})=>{
  return {
    id,
    userId:session.userId,
    username: session.username
  }
}

const serialize = (session:Session)=>{
  return {
    userId:session.userId,
    username:session.username
  }
}