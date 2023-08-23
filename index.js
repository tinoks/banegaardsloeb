require('dotenv').config();

const path = require('path')
const fastify = require('fastify')({
    logger: true
})
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
fastify.register(fastifyCookie);

fastify.register(fastifySession, {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
    expires: 1800000
});

fastify.register(require('@kortxyz/auth-msal'), { prefix: 'auth' });

fastify.register(require('@kortxyz/ogcapi-gpkg'), {
    baseUrl: 'http://127.0.0.1:3000',
    gpkg: 'Banegaardsloeb.gpkg',
    skipLandingpage: true,
})

fastify.register(require("@fastify/view"), {
    engine: {
        eta: require("eta"),
    },
    root: path.join(__dirname, "./views"),
});




fastify.register(require('@fastify/cors'), { exposedHeaders: 'Content-Disposition' });

fastify.register(async (instance, opts, done) => {
    // authenticated routes
    instance.addHook('preHandler', (req, reply, done) => {
        if (!req.session?.isAuthenticated) {
            return reply.redirect('/auth/signin'); // redirect to sign-in route
        }
        done()
    })

    instance.get('/', async (req, reply) => {
        reply.view("index", { name: req.session.account?.username });
    })

    instance.get('/result', async (req, reply) => {
        reply.view("result");
    })

})


fastify.listen({ port: 3000,  host: '0.0.0.0'}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
})