import { IResolvers } from 'graphql-tools';
import query from './query';
import types from './types';
import mutation from './mutations';
import subscription from './subscription';

export const LIST: string [] = [ ];
const resolvers : IResolvers = {
    ...query,
    ...types,
    ...mutation,
    ...subscription
};

export default resolvers;