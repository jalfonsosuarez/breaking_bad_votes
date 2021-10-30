import { resourceLimits } from 'worker_threads';
import { COLLECTIONS } from '../config/constants';

export async function getCharacters( db: any ) {
    return await db.collection( COLLECTIONS.CHARACTERS )
                    .find().sort( { id: 1 } ).toArray();
}

export async function getCharacter( db: any, id: string ) {
    return await db.collection( COLLECTIONS.CHARACTERS )
                    .findOne( { id } );
}

export async function getCharacterVotes( db: any, id: string ) {
    return await db.collection( COLLECTIONS.VOTES )
                    .find( { character: id } ).count();
}

export async function getVoteId( db: any ) {
    const lastVote = await db.collection( COLLECTIONS.VOTES )
                              .find().sort( { _id: -1 }).limit(1).toArray();
    if ( lastVote.length === 0 ) {
        return '1';
    }
    return String( +lastVote[0].id + 1 );
}

export async function getVote( db: any, id: string ) {
    return await db.collection( COLLECTIONS.VOTES )
                    .findOne( { id } );
}