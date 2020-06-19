var express = require('express');
var app = express();
var ldapjs = require('ldapjs');
const path = require('path');
var bodyParser = require('body-parser');

// EXPRESS SETTINGS
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/user', (req, res) => {
    res.render('user.html');
});

app.get('/error', (req, res) => {
    res.render('error.html');
});

// SERVER LISTENING
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});

function autenticarDN(username, password, res){
    var resultadoLogin = 0;
    var client = ldapjs.createClient({
        // Prueba con VM
        url: 'ldap://13.84.212.95'

        // Prueba con LDAP publico
        /*url: 'ldap://ldap.forumsys.com:389'*/

        // Prueba con LDAP local
        //url: 'ldap://127.0.0.1:10389'
    });
    // Se realiza validacion con resultado de bind()
    client.bind(username, password, function(err) {
        // Si la conexion fue incorrecta, los datos ingresados son incorrectos
        if(err){
            console.log("Error en conexion "+err);
            resultadoLogin = 0;
        // Si la conexion correcta, los datos ingresados son correctos y el usuario existe
        } else{
            console.log('Conexion exitosa');
            resultadoLogin = 1;
        }
        if (resultadoLogin == 1){
            console.log('Acceso exitoso, bienveido '+username);
            return res.redirect('/user');
        } else{
            console.log('Acceso denegado');
            return res.redirect('/error');
        }
    });
}

// AUTHENTICATION
app.post("/", function(request, response) {
    var username = request.body.username;
    var password = request.body.password;

    //  Prueba para ldap VM
    var usuarioCompleto = 'uid='+username+',ou=usuarios,dc=southcentralus,dc=cloudapp,dc=azure,dc=com';
    /*var usuarioCompleto = 'cn='+username+',dc=southcentralus,dc=cloudapp,dc=azure,dc=com;'*/

    // Prueba para ldap publico
    /*var usuarioCompleto = 'cn='+username+',dc=example,dc=com';*/
    /*var usuarioCompleto = 'uid='+username+'ou=mathematicians,dc=example,dc=com';*/

    // Prueba para ldap local
    //var usuarioCompleto = 'cn='+username+', ou=users,ou=system';

    // Llamada al metodo
    autenticarDN(usuarioCompleto, password, response);
});