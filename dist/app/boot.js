System.config({
    packages: {
        app: {
            format: 'register',
            defaultExtension: 'js'
        }
    }
});
System.import('dist/app/main.js')
    .then(null, console.error.bind(console));
