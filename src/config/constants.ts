import environments from './environments';

if (process.env.NODE_ENV !== 'production') {
    const environment = environments;
}

export const COLLECTIONS = {
    CHARACTERS: 'characters',
    VOTES: 'votes'
};

export const PHOTO_URL = 'https://raw.githubusercontent.com/graphql-course/5-breaking-bad-graphql-voting/master/photos/';

export const CHANGE_VOTES = 'CHANGE_VOTES';

export const CHANGE_VOTE = 'CHANGE_VOTE';