import cors from 'cors';

// Define CORS options
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

const corsSetup = () => {
    return cors(corsOptions);
};

export default corsSetup;