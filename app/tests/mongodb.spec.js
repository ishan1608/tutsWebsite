describe("MongoDB Test", function(){
    it("Sever should be running", function(next){
        var MongoCli = require('mongodb').MongoClient;
        MongoCli.connect('mongodb://127.0.0.1:27017', function(err, db) {
            expect(err).toBe(null);
            expect(db).toBeDefined();
            next();
        });
    });
});    