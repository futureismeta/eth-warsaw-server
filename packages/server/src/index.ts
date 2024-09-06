import { app } from './server';
import { PORT } from './config/config';

console.log("Listening on port", PORT);
app.listen(PORT);
