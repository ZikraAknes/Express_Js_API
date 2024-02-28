import express from 'express';
import todoRoutes from './src/routers/todo.r.mjs'
import authRoutes from './src/routers/auth.r.mjs'
import authenticateToken from './src/middlewares/middleware.mjs';

const app = express();
const PORT = 3000;

app.use( express.json() )

app.listen(PORT, () => {
    console.log(`it's alive on http://localhost:${PORT}`);
});

app.use('/api/todo', authenticateToken, todoRoutes)
app.use('/auth', authRoutes)



