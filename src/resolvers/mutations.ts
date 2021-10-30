import { IResolvers } from 'graphql-tools';
import { getCharacter, getCharacters, getVote, getVoteId } from '../lib/database-operations';
import { Datetime } from '../lib/datetime';
import { COLLECTIONS } from '../config/constants';
import { createImmediatelyInvokedArrowFunction } from 'typescript';

const mutation: IResolvers = {
    Mutation: {
        async addVote ( _: void, { character }, { db } ) {
            const selectCharacter = await getCharacter( db, character );           
            if ( selectCharacter === null || selectCharacter === undefined ) {
                return {
                    status: false,
                    message: 'Personaje no existe.',
                    characters: await getCharacters( db )
                };
            }
            
            const vote = {
                id: await getVoteId( db ),
                character,
                createdAt: new Datetime().getCurrentDateTime()
            };

            return await db.collection( COLLECTIONS.VOTES ).insertOne( vote )
                .then( async () => {
                    return {
                        status: true,
                        message: 'Voto emitido',
                        characters: await getCharacters( db )
                    };
                })
                .catch( async (error: any) => {
                    return {
                        status: false,
                        message: `Error en el servidor ${error}`,
                        characters: await getCharacters( db )
                    };
                });

        },

        async updateVote ( _: void, { id, character }, { db } ) {
            const selectCharacter = await getCharacter( db, character );           
            if ( selectCharacter === null || selectCharacter === undefined ) {
                return {
                    status: false,
                    message: 'Personaje no existe.',
                    characters: await getCharacters( db )
                };
            }
                        
            const selectVote = await getVote( db, id );           
            if ( selectVote === null || selectVote === undefined ) {
                return {
                    status: false,
                    message: 'Voto no existe.',
                    characters: await getCharacters( db )
                };
            }
            
            return await db.collection( COLLECTIONS.VOTES )
                            .updateOne( { id }, { $set: { character } } )
                            .then( 
                                async() => {
                                    return {
                                        status: true,
                                        message: 'Voto actualizado',
                                        characters: await getCharacters( db )
                                    };
                                }
                                )
                                .catch(
                                    async(error: any) => {                                        
                                        return {
                                            status: false,
                                            message: `Error al actualizar voto ${ error }`,
                                            characters: await getCharacters( db )
                                        };
                                }
                            );
        },

        async deleteVote( _: void, { id }, { db } ) {
            const selectVote = await getVote( db, id );           
            if ( selectVote === null || selectVote === undefined ) {
                return {
                    status: false,
                    message: 'Voto no existe.',
                    characters: await getCharacters( db )
                };
            }
            
            return await db.collection ( COLLECTIONS.VOTES )
                            .deleteOne( { id } )
                            .then( 
                                async() => {
                                    return {
                                        status: true,
                                        message: 'Voto eliminado',
                                        characters: await getCharacters( db )
                                    };
                                }
                                )
                                .catch(
                                    async(error: any) => {                                        
                                        return {
                                            status: false,
                                            message: `Error al eliminar voto ${ error }`,
                                            characters: await getCharacters( db )
                                        };
                                }
                            );                            
        }

    }
};

export default mutation;