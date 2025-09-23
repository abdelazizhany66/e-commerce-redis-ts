import { client } from '$services/redis';
import  { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { serialize } from './serialize';
import { itemsKey, itemsByViewKey, itemByEndingAtKey } from '$services/keys';
import { deserialize } from './deserialize'


export const getItem = async (id: string) => {
const item =  await client.hGetAll(itemsKey(id))

if(Object.keys(item).length === 0){
  return null
}

 return deserialize(id,item)
};

export const getItems = async (ids: string[]) => {
  const commands = ids.map((id)=>{
    return client.hGetAll(itemsKey(id))
  })
  
  const results = await Promise.all(commands)

  return results.map((result,i )=>{
    if(Object.keys(result).length === 0){
      return null
    }
    return deserialize(ids[i],result)
  })
};

export const createItem = async (attrs: CreateItemAttrs) => {
  const id = genId()
  const serialized = serialize(attrs)
  await Promise.all([
    client.hSet(itemsKey(id) , serialized),
    //add to sort set useing id item sum views
    client.zAdd(itemsByViewKey(),{
      value: id,
      score:0
    }),
    //add to sorte set sorte data will be expire soonest
    client.zAdd(itemByEndingAtKey(),{
      value:id,
      score:attrs.endingAt.toMillis()
    })
  ])
  return id
};
