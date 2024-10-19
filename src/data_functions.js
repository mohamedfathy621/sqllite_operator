//this is the heavy duty class which handels all the work
const console = require('console');

const error = console.error;
class Data_Golem{
    
    constructor(rl,db,trantino) {
        this.rl = rl;
        this.db =db;
        this.trantino=trantino;
      }
    //this function creates a table ;
    async  create_table(table_name){
        //first part it asks for a table name
        var coulmns="";
        const name_regex=/^[A-Za-z_][A-Za-z0-9_]*$/;
        if(!name_regex.test(table_name)){
            console.log("bad name enter a valid one");
            return;
        }
        console.clear();
        //second part you enter the data coloumns for the table
        coulmns=await this.add_column(coulmns,table_name);
        
        while(true){
        //first of all the the sql query is displayed for the user 
         const sql=`CREATE TABLE IF NOT EXISTS ${table_name} (${coulmns[0]} ${coulmns[1].length>0?','+coulmns[1].map((refes)=>`FOREIGN KEY(${refes[0]}) REFERENCES ${refes[1]}(${refes[2]})`):''})`;
         console.log(sql);
         //the user is prestend options to drop a coloumn , add another one , restart the operation , change the table name , or accept it and create the table
         const confirm = await this.trantino.ask("\nD-drop a coloumn\nA-add another coloumn\nR-restart\nC-change table name\n"+(coulmns[0].length>0?"y-accept and add table\n":""));
         console.clear();
         //if a coloumn is chosen to be droped you see a list of coloumn and chose the coloumn index to delete it
         //it's all manipulated in the coloumn array 
         if(confirm.toLowerCase()=='d'){
             const arr=coulmns[0].split(',');
             while(true){
                 const index = await this.trantino.ask("\n"+arr.map((cols,index) => (index+1)+"-"+cols+"\n")+"enter column index to remove\n");
                 console.log("this is index "+index);
                 console.clear();
                 if(parseInt(index)>arr.length||/\D/.test(index)){
                    
                    console.log("please enter a valid index");
                    continue;
                 }
                 else{
                    arr.splice(index-1, 1);
                    break;
                 }
             }
             coulmns[0]=arr.join(',');
         }
         //add another coloumn seems easy
         if(confirm.toLowerCase()=='a'){
            coulmns[0]=await this.add_column(coulmns[0],table_name);
         }
         //a new table name is asked and changed in the original query
         if(confirm.toLowerCase()=='c'){
            while(true){
                const new_name = await this.trantino.ask("\nenter new table name\n");
                console.clear();
                if(!name_regex.test(new_name)){
                    console.log("bad name enter a valid one");
                    continue;
                }
                else{
                    table_name=new_name;
                    break;
                }
            }
         }
         //it just returns to the second_level
         if(confirm.toLowerCase()=='r'){
            return;
         }
         //it accepts and sends the query
        if(confirm.toLowerCase()=='y'){
            await this.show_database(sql);
            return;
        }
        else{
            console.log("invalid input please enter a valid character");
            continue;
        }
     }
    }
    //this is the add coloumn function
    async add_column(coulmns,table_name){
        //this regex are used to check for the correct input to avoid sql errors
        const name_regex=/^[A-Za-z_][A-Za-z0-9_]*$/;
        const type_regex=/^(INTEGER|TEXT|REAL|BLOB|NUMERIC|VARCHAR\(\d+\)|CHAR\(\d+\))$/;
        var logic=true;
        var foreign=[];
        coulmns=coulmns.length>0?coulmns+", ":coulmns;
        //a loop to enter as many coloumns as the user likes
        while(logic){
            var coloumn_name='';
            var coloumn_type='';
            var primary='';
            var auto_inc='';
            var message='';
            while(true){
                //first it asks for a coloumn name and run it be the regex
                 coloumn_name = await this.trantino.ask("\nenter column name to add\n");
                console.clear();
                if(!name_regex.test(coloumn_name)){
                    console.log("bad name enter a valid column name\n");
                    continue;
                }
                else{
                    coulmns=coulmns+coloumn_name+" ";
                    message='coloumn_name= '+coloumn_name;
                    break;
                }
            }
            //then it asks for the coloumn type and runs it by the regex
            while(true){
                coloumn_type = await this.trantino.ask(message+"\nenter column type to add\n");
                console.clear();
                if(!type_regex.test(coloumn_type)){
                    console.log("invalide type please enter a correct type\n");
                    continue;
                }
                else{
                    coulmns=coulmns+coloumn_type+" ";
                    message=message+', coloumn_Type= '+coloumn_type;
                    break;
                }
            }
            //then it asks if the coloumn is a primary key or not
            while(true){
                 primary = await this.trantino.ask(message+"\nis it a Primary key (y/n)\n");
             console.clear();
                if(primary.toLowerCase()=='y'){
                    coulmns=coulmns+"PRIMARY KEY ";
                    message=message+', IsPrimary ';
                    break;
                }
                else if(primary.toLowerCase()=='n'){
                    break;
                }
                else{
                    console.log("invalide input please enter Y for yes or N for \n");
                }
            }
            //then it asks if the coloumn is auto_increment or not 
            while(true){
                auto_inc = await this.trantino.ask(message+"\nis it a Auto incremented (y/n)\n");
             console.clear();
               if(auto_inc.toLowerCase()=='y'){
                   coulmns=coulmns+"AUTOINCREMENT";
                   message=message+', AUTOINCREMENT ';
                   break;
               }
               else if(auto_inc.toLowerCase()=='n'){
                   break;
               }
               else{
                   console.log("invalide input please enter Y for yes or N for \n");
               }
           }
           while(true){
                auto_inc = await this.trantino.ask(message+"\nis it a foreign key (y/n)\n");
                console.clear();
                if(auto_inc.toLowerCase()=='y'){
                    const domino=await this.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence' AND name != '${table_name}';`)
                    if(domino.length>0){
                    while(true){
                        const rela=await this.trantino.ask(JSON.stringify(domino)+"\n\nenter the table which the key points to\n");
                        console.clear();
                        if(domino.some(table=> table.name == rela)){
                            const trop=await this.show_database(`PRAGMA table_info(${rela});`)
                            if(trop.some(columns=> columns.pk===1 && coloumn_type==columns.type)){
                                while(true){
                                    const coloumns="{\t "+trop.map(column =>`${column.pk==1?`[**${column.name}**]`:''}`)+"\t}\n";
                                    const mazn=await this.trantino.ask(coloumns+"choose a coloumn to refernce\n");
                                    console.clear();
                                    if(trop.some(column=> column.name === mazn)){
                                            foreign.push([coloumn_name,rela,mazn]);
                                            message=message+`, refrences ${rela} on ${mazn}`;
                                            break;
                                    }
                                    else{
                                        console.log("invalid key");
                                        continue;
                                    }
                                }
                                break;
                            }
                            else{
                                console.log("this table doesn't have valid keys for refrence\n");
                                break;
                            }
                        }
                        else{
                            console.log("no such table\n");
                            continue;
                        }
                    }
                    }
                else{
                    console.log("no other tables in the database");
                }
                    break;
                }
                else if(auto_inc.toLowerCase()=='n'){
                    break;
                }
                else{
                    console.log("invalide input please enter Y for yes or N for \n");
                }
            }
           //it asks if you want to enter another coloumn
           while(true){
            const another_one = await this.trantino.ask(message+"\nwant to add another coloumn (y/n)\n");
           console.clear();
           if(another_one.toLowerCase()=='y'){
               coulmns=coulmns+", ";
               break;
           }
           else if(another_one.toLowerCase()=='n'){
               coulmns=coulmns;
               logic=false;
               break;
           }
           else{
               console.log("invalide input please enter Y for yes or N for \n");
           }
           }
           
        }
        return [coulmns,foreign];
    }
    //this function is used to search tables
    async serch_database(table_name,table_col,operation){
        var logic=true;
        console.log(table_col);
        //first it list the coloumns in the said table
        const coloumns="{\n "+table_col.map(column =>"["+["Name **"+column.name+"**","Type "+column.type,column.pk==1?"iSPrimary":"NotPrimary"]+"]\n")+"}";
        var coloumn;
        //it asks you to enter a coloumn in this table
        while(logic){
             coloumn = await this.trantino.ask(coloumns+"\nenter coloumn name to search for "+operation+"\nenter @b to exit\n");
            if(coloumn.toLowerCase()=="@b"){
                console.clear();
                return '';
            }
            table_col.map(col => {
                if(col.name===String(coloumn)){
                    logic=false;
                }
            })
                console.clear();
                if(logic){
                console.log('\rno such coloumn');
                continue;
                }
            
        }
        logic=true;
        var value;
        //then it asks you to enter the value of the row you want to search for
        //it handels the operations of read (SEARCH), update (MODIFY), delete (DELETE) based on a switch case router
        while(true){
             value = await this.trantino.ask("\nenter value to search for "+operation+"\nenter @b to exit\n");
        if(value.toLowerCase()=="@b"){
            console.clear();
            return '';
        }
        const sql=`SELECT * from ${table_name} WHERE ${coloumn} = '${value}'`;  
        const result=await  this.show_database(sql);
        if(result.length>0){
            break;
        }
        else{
            console.clear();
            console.log("No such data exist");
            continue;
        }
        }
        switch(operation){
            case 'SEARCH':{
                const sql=`SELECT * from ${table_name} WHERE ${coloumn} = '${value}'`;
                try{
                 console.log(sql);
                 const result=await  this.show_database(sql);
                 console.clear();
                 await this.trantino.display(table_name,result);
                }
                 catch(error){
                    console.log(error.message+" "+s+"\n");
                 }
                 break;
            }
            case 'DELETE':{ 
                const sql=`DELETE from ${table_name} WHERE ${coloumn} = '${value}' `; 
                try{
                    console.log(sql);
                    await this.show_database(sql);
                    console.log("row deleted succesfully");
                   }
                    catch(error){
                        console.log(error.message+" "+s+"\n");
                }
                break;
    
            }
            case 'MODIFY':{
                var sec_column;
                while(logic){
                     sec_column = await this.trantino.ask(coloumns+"\nchoose a coloumn to "+operation+"\nenter @b to exit\n");
                    if(sec_column.toLowerCase()=="@b"){
                        console.clear();
                        return '';
                    }
                   table_col.map(col => {
                       if(col.name===String(sec_column)){
                           logic=false;
                       }
                   })
                       console.clear();
                       if(logic){
                       console.log('\rno such coloumn');
                       continue;
                       }
               }
               
               while(true){
                const sec_value =await this.trantino.ask("\nenter new value for modification \nenter @b to exit\n");
                if(sec_value.toLowerCase()=="@b"){
                    console.clear();
                    return '';
                }
                const sql=`UPDATE ${table_name} SET  ${sec_column}  = '${sec_value}'  WHERE ${coloumn} = '${value}'`; 
                try{
                    console.log(sql);
                    await this.show_database(sql);
                    console.log("Mod done succesfully")
                    break;
                   }
                    catch(error){
                        console.log(error.message+" "+s+"\n");
                    continue;
                }
                }
                break;
            }
            }
    }
    //this is a basic function to handle sql queries 
     show_database(sql){
    
        return new Promise((resolve, reject) => {
            try{
                this.db.all(sql,(err, rows) => {
                if (err) {
                    console.log(error);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        }
            catch(error){
                reject(error);
            }
        });
    }
    //this function is used to insert data
    async insert_data(table_name,table_cols){
        var values=[]
        for(var i=0;i<table_cols.length;i++){
            const col=table_cols[i];
            //first it presnts each coloumn and asks the user wether he wants to enter a value or skip the coloumn
            while(true){
                const answer= await this.trantino.ask(`do you want to insert into coloumn **${col.name}** (y/n) enter R for restart @b to go back\n`);
                console.clear();
                if(String(answer).toLowerCase()=='n'){
                    console.log(`column ${col.name} skipped\n`)
                    break;
                }
                //if he choses to enter a value first it checks for the type and if it passes the test the value is saved
                if(String(answer).toLowerCase()=='y'){
                    while(true){
                        const answer= await this.trantino.ask(`insert value in column name=${col.name}\ttype=${col.type}\tprimary=${col.pk==1?"iSPrimary":"NotPrimary"}\n`);
                        console.clear();
                        if(this.insertion_checker(col.type,answer)){
                            values.push([col.name,`'${answer}'`]);
                            break;
                        }
                        else{
                            console.log("please enter a valid value\n");
                        }
                    }
                    break;
                }
                //restarts the insertion process
                else if(String(answer).toLowerCase()=='r'){
                    values=[];
                    i=-1;
                    break;
                }
                //exists the insertion process
                else if(String(answer).toLowerCase()=='@b'){
                    return false;
                }
                else{
                    console.log("invalid input please enter a valid option\n");
                    continue;
                }
            }
        }
        const sql=`INSERT INTO ${table_name} (${values.map(names => names[0]).join(',')}) VALUES (${values.map(answers => answers[1]).join(',')})\n`;
        console.log(sql);
        try{
            await this.show_database(sql);
            console.log("row inserted succesfully");
           }
            catch(error){
                console.log("error inserting row\n"+error.message);
        }
    }
    //checks the input data before insertion to avoid sql errors using regex
    insertion_checker(coloumn_type,answer){
        
        if(coloumn_type.match(/^[a-zA-Z]+/)[0]=='VARCHAR'){
            const n=parseInt(coloumn_type.match(/\((\d+)\)/)[1]);
            const regex = new RegExp(`^.{0,${n}}$`);
            return regex.test(answer);
        }
        else if(coloumn_type.match(/^[a-zA-Z]+/)[0]=='char'){
            const n=parseInt(coloumn_type.match(/\((\d+)\)/)[1]);
            const regex = new RegExp(`^.{${n}}$`);
            return regex.test(answer);
        }
        else{
        switch(true){
            case /INTEGER/.test(coloumn_type):
               return /^-?\d+$/.test(answer)
            case /TEXT/.test(coloumn_type):
               return /^.*$/.test(answer)
            case /REAL/.test(coloumn_type):
               return /^-?\d+(\.\d+)?$/.test(answer)
            case /BLOB/.test(coloumn_type):
               return /^[a-fA-F0-9]+$/.test(answer)
            case /NUMERIC/.test(coloumn_type):
               return  /^-?\d+(\.\d+)?$/.test(answer)
            default:
                return false;
            }
        }
    }
}

module.exports = Data_Golem;