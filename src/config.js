// Both stages have different ARN and region
// Choose config object based on what the stage was set on build

const dev = {
    // AWS Amplify configuration (used in index.js)
    s3: {
        REGION: 'eu-west-2',
        BUCKET: 'noteit-api-dev-attachmentsbucket-t69bbehxrf92'
    },
    apiGateway: {
        REGION: 'eu-west-2',
        URL: 'https://durla25rqd.execute-api.eu-west-2.amazonaws.com/dev'
    },
    cognito: {
        REGION: 'eu-west-2',
        USER_POOL_ID: 'eu-west-2_LV0AhENLg',
        APP_CLIENT_ID: '4jlc857ud7hpq9hh28a3bmnoeb',
        IDENTITY_POOL_ID: 'eu-west-2:4154f713-2c13-4ab4-9e9a-5bf24c6b5561'
    }
};

// TODO change this to prod config when first prod build is deployed
const prod = {
    // AWS Amplify configuration (used in index.js)
    s3: {
        REGION: 'eu-west-2',
        BUCKET: 'noteit-note-attachments'
    },
    apiGateway: {
        REGION: 'eu-west-2',
        URL: 'https://durla25rqd.execute-api.eu-west-2.amazonaws.com/dev'
    },
    cognito: {
        REGION: 'eu-west-2',
        USER_POOL_ID: 'eu-west-2_1lnI61cPa',
        APP_CLIENT_ID: '2i00t5marr54ua87c781j1tt6b',
        IDENTITY_POOL_ID: 'eu-west-2:417f1eb9-cf1b-4d96-961d-5a5b7e10ac28'
    }
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {
    // For note attachments, we define a max size
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
};
