// Both stages have different ARN and region
// Choose config object based on what the stage was set on build

const dev = {
    // AWS Amplify configuration (used in index.js)
    s3: {
        REGION: 'eu-west-2',
        BUCKET: 'noteit-s3-dev-s3bucket-113ly0fvvd8g2'
    },
    apiGateway: {
        REGION: 'eu-west-2',
        URL: 'https://zkr5up7rq9.execute-api.eu-west-2.amazonaws.com/dev'
    },
    cognito: {
        REGION: 'eu-west-2',
        USER_POOL_ID: 'eu-west-2_HpGyDWIX9',
        APP_CLIENT_ID: '1ds24v7glk3jtn6oodinus16qv',
        IDENTITY_POOL_ID: 'eu-west-2:66c7fe5b-eb66-4c09-92c5-45f155d487fe'
    },
    STRIPE_KEY: 'pk_test_VP2Btjebn50kxpP9ltnGe5MS003pB5inAp'
};

// TODO change this to prod config when first prod build is deployed
const prod = {
    // AWS Amplify configuration (used in index.js)
    s3: {
        REGION: 'eu-west-2',
        BUCKET: ''
    },
    apiGateway: {
        REGION: 'eu-west-2',
        URL: ''
    },
    cognito: {
        REGION: 'eu-west-2',
        USER_POOL_ID: 'eu-west-2',
        APP_CLIENT_ID: '',
        IDENTITY_POOL_ID: 'eu-west-2:'
    },
    STRIPE_KEY: 'pk_prod_'
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {
    // For note attachments, we define a max size
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
};
