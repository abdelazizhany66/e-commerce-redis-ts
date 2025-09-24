import { bidHistoryId } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid } from '$services/types';
import { serialize } from 'cookie';
import { DateTime } from 'luxon';

export const createBid = async (attrs: CreateBidAttrs) => {
	const serialize = serializeHistory(attrs.amount,attrs.createdAt.toMillis())
	return  client.rPush(bidHistoryId(attrs.itemId),serialize)
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10) => {
 const startIndex = -1*offset-count
 const endIndex = -1-offset

 const range = await client.lRange(
	bidHistoryId(itemId),
	startIndex,
	endIndex
	)
	//return{amount:45,createAt:53422322}
 return range.map(bid=> deserialize(bid))
};


const serializeHistory = (amount:number,createAt:number)=>{
	return `${amount}:${createAt}`
	}

	
const deserialize = (sorted:string)=>{
	const  [amount, createAt]  = sorted.split(':')
	return{
			amount: parseFloat(amount),
			createAt: DateTime.fromMillis(parseInt(createAt))
		}
	}
