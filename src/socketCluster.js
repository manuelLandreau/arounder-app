import socketCluster from 'socketcluster-client';

export function initSCluster() {
    const options = {
        path: '/socketcluster/',
        port: 8000,
        hostname: 'http://aroundhere-aroundhere.1d35.starter-us-east-1.openshiftapps.com', // 192.168.43.160
        autoConnect: true,
        secure: false,
        rejectUnauthorized: false,
        // connectTimeout: 10000, //milliseconds
        ackTimeout: 10000, //milliseconds
        channelPrefix: null,
        disconnectOnUnload: true,
        multiplex: true,
        autoReconnectOptions: {
            initialDelay: 10000, //milliseconds
            randomness: 10000, //milliseconds
            multiplier: 1.5, //decimal
            maxDelay: 60000 //milliseconds
        },
        // authEngine: null,
        // codecEngine: null,
        // subscriptionRetryOptions: {},
        // query: {
        //     yourparam: 'hello'
        // }

    };

    return new Promise((resolve, reject) => {
        const sCluster = socketCluster.connect(options);
        sCluster ? resolve(sCluster) : reject();
    });
}