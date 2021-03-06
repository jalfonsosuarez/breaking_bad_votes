import { withFilter } from 'graphql-subscriptions';
import { IResolvers } from 'graphql-tools';
import { CHANGE_VOTE, CHANGE_VOTES } from '../config/constants';

const subscription: IResolvers = {
    Subscription: {
        changeVotes: {
            subscribe: ( _: void, __: any, { pubsub } ) => {
                return pubsub.asyncIterator( CHANGE_VOTES );
            }
        },
        
        changeVote: {
            subscribe: withFilter( ( _: void, __: any, { pubsub } ) =>
                pubsub.asyncIterator( CHANGE_VOTE ),
                (payload, variables) => {
                    return payload.changeVote.id === variables.id;
                }
            ),
        },
    }
};

export default subscription;
