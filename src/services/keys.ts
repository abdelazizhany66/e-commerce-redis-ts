export const pageCacheKey = (id:string)=> `pagecache#${id}`
export const usersKey = (userId:string)=> `usercache#${userId}`
export const sessionsKey = (sessionId:string)=> `sessioncache${sessionId}`
export const itemsKey = (itemId:string)=> `item#${itemId}`
export const usernamesUniqueKey = ()=> 'username:unique'
export const userLikesKey = (userId:string)=> `user:like#${userId}` 