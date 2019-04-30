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
        URL: 'https://tht4et63ag.execute-api.eu-west-2.amazonaws.com/dev'
    },
    cognito: {
        REGION: 'eu-west-2',
        USER_POOL_ID: 'eu-west-2_Sr1X8e8BY',
        APP_CLIENT_ID: '7tre90gkb874rll9lo0faicihs',
        IDENTITY_POOL_ID: 'eu-west-2:fc92a467-a1ad-4bbf-851d-350f31b2da5f'
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
    STRIPE_KEY: 'pk_live_01xk8LJlLQUtLpTpJWvQdSbz00XUUTnN5P'
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;

export default {
    // For note attachments, we define a max size
    MAX_ATTACHMENT_SIZE: 5000000,
    DEFAULT_NOTES_PAGE_SIZE: 5,
    ...config
};
