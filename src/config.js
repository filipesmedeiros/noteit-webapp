export default {
    // For note attachments, we define a max size
    MAX_ATTACHMENT_SIZE: 5000000,

    // AWS Amplify configuration (used in index.js)
    s3: {
        REGION: 'eu-west-3',
        BUCKET: 'noteit-note-attachments'
    },
    apiGateway: {
        REGION: 'eu-west-3',
        URL: 'https://r16zeytff8.execute-api.eu-west-3.amazonaws.com/prod'
    },
    cognito: {
        REGION: 'eu-west-2',
        USER_POOL_ID: 'eu-west-2_1lnI61cPa',
        APP_CLIENT_ID: '2i00t5marr54ua87c781j1tt6b',
        IDENTITY_POOL_ID: 'eu-west-2:417f1eb9-cf1b-4d96-961d-5a5b7e10ac28'
    }
};
