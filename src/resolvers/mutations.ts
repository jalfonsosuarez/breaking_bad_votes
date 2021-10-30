import { IResolvers } from 'graphql-tools';
import { getCharacter, getCharacters, getVote, getVoteId } from '../lib/database-operations';
import { Datetime } from '../lib/datetime';
import { COLLECTIONS, CHANGE_VOTES } from '../config/constants';

async function response( status: boolean, message: string, db: any ) {
    return {
        status,
        message,
        characters: await getCharacters( db )
    };
}

async function sendNotification( pubsub: any, db: any ) {
    pubsub.publish( CHANGE_VOTES, { changeVotes: await getCharacters( db ) } );
}

const mutation: IResolvers = {
    Mutation: {
        async addVote ( _: void, { character }, { pubsub, db } ) {
            const selectCharacter = await getCharacter( db, character );           
            if ( selectCharacter === null || selectCharacter === undefined ) {
                return response( 
                    false,
                    'Personaje no existe.',
                    db );
            }
            
            const vote = {
                id: await getVoteId( db ),
                character,
                createdAt: new Datetime().getCurrentDateTime()
            };

            return await db.collection( COLLECTIONS.VOTES ).insertOne( vote )
                .then( async () => {
                    sendNotification( pubsub, db );
                    return response( 
                        true,
                        'Voto emitido',
                        db );
                })
                .catch( async (error: any) => {
                    return response (
                        false,
                        `Error en el servidor ${error}`,
                        db );
                });

        },

        async updateVote ( _: void, { id, character }, { pubsub, db } ) {
            const selectCharacter = await getCharacter( db, character );           
            if ( selectCharacter === null || selectCharacter === undefined ) {
                return response( 
                    false,
                    'Personaje no existe.',
                    db );
            }
                        
            const selectVote = await getVote( db, id );           
            if ( selectVote === null || selectVote === undefined ) {
                return response( 
                    false,
                    'Voto no existe.',
                    db );
            }
            
            return await db.collection( COLLECTIONS.VOTES )
                            .updateOne( { id }, { $set: { character } } )
                            .then( 
                                async() => {
                                    sendNotification( pubsub, db );
                                    return response(
                                        true,
                                        'Voto actualizado',
                                        db );
                                }
                                )
                                .catch(
                                    async(error: any) => {                                        
                                        return response(
                                            false,
                                            `Error al actualizar voto ${ error }`,
                                            db );
                                }
                            );
        },

        async deleteVote( _: void, { id }, { pubsub, db } ) {
            const selectVote = await getVote( db, id );           
            if ( selectVote === null || selectVote === undefined ) {
                return response( 
                    false,
                    'Voto no existe.',
                    db );
            }
            
            return await db.collection ( COLLECTIONS.VOTES )
                            .deleteOne( { id } )
                            .then( 
                                async() => {
                                    sendNotification( pubsub, db );
                                    return response( 
                                        true,
                                        'Voto eliminado',
                                        db );
                                }
                                )
                                .catch(
                                    async(error: any) => {                                        
                                        return response( 
                                            false,
                                            `Error al eliminar voto ${ error }`,
                                            db );
                                }
                            );                            
        }

    }
};

export default mutation;