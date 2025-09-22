import { itemsKey, userLikesKey, usernamesUniqueKey } from "$services/keys";
import { client } from "$services/redis";
import { getItems } from "./items";

export const userLikesItem = async (itemId: string, userId: string) => {};

export const likedItems = async (userId: string) => {
  //get all members = 'id items like' from set this user liked
  const ids = await client.sMembers(userLikesKey(userId))
 //search with this ids because this getitems using pipeline =promise.all()
  return getItems(ids)
};

export const likeItem = async (itemId: string, userId: string) => {
  //search for user and add this item green key
  const inserted = await client.sAdd(userLikesKey(userId), itemId )
  //and add 1 to column like to this item
  if(inserted){
    return await client.hIncrBy(itemsKey(itemId),'like',1)
  }
};

export const unlikeItem = async (itemId: string, userId: string) => {
  const removed = await client.sRem(userLikesKey(userId),itemId)
  if(removed){
    return await client.hIncrBy(itemsKey(itemId),'like', -1)
  }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
  // this functiojn return all items two useers same like 
  const ids = await client.sInter([userOneId,userTwoId])
  return getItems(ids)
};
