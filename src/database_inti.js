const fs = require('fs').promises; // Import the promises API from the fs module
const sqlite3 = require('sqlite3');  // Import sqlite3
class DATA_begin{
    
    async  start(){
        try{
            console.log('opening file >>>>');
            await fs.access('./assets/datasets.txt');
        }   
        catch{
            console.log('file not found\n creating file >>>>>');
            try {
                await fs.writeFile('./assets/datasets.txt', '');
                console.log('Datasets file created.');
            } catch (writeErr) {
                console.error('Error writing to the file:', writeErr);
            } 
        }
     }
    async read(){
        try {
            const data = await fs.readFile('./assets/datasets.txt', 'utf8');
            return data;
        } catch (err) {
            console.error('Error reading the file:', err);
        }
    }
    async write(data_array,data_file){
        
        try{
            await fs.writeFile('./assets/datasets.txt', data_array);
            const db = await this.ini_database(data_file); 
            db.close((err) => {
                if (err) {
                    console.error('Error closing the database:', err.message);
                } 
            });
            console.log('Database file created.');
        }
        catch(writeErr){
            console.error('Error writing to the file:', writeErr);
        }
    }
    async data_remove(data_file){
        try {
            await fs.unlink(`./assets/${data_file}.db`);
            console.log('File deleted successfully');
        } catch (err) {
            console.error('Error deleting the file:', err);
        }
    }
    ini_database(db_name){
        return new Promise((resolve, reject) => {
            const db =   new sqlite3.Database(`./assets/${db_name}.db`, (err) => {
                if (err) {
                    console.error('Error opening database', err.message);
                    reject(err);
                } else {
                    resolve(db);
                }
        });
    });
    }
}

module.exports = DATA_begin;

