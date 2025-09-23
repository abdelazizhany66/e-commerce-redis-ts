import { itemsByViewKey, itemsKey } from "$services/keys";
import { client } from "$services/redis";

export const incrementView = async (itemId: string, userId: string) => {
  await Promise.all([
    client.hIncrBy(itemsKey(itemId),'view',1),
    client.zIncrBy(itemsByViewKey(),1, itemId)
  ])
};
