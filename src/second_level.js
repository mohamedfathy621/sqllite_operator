
//this is the second level class which handels the real work 
class second_level{
    //trantino is an object of database_display 
    //macman is an object of database_creation
    //rl is an object of Readline 
    constructor(rl,macman,trantino) {
        this.rl = rl;
        this.macman=macman
        this.trantino=trantino;
      }
    //this level cuts the input into two parts the first part is the (code) used in navigation and routing and the second part is the (input) used to handel operations
    async resolve(code,input,message){
        switch(code){
            //this is the display table rows operation
            case '011':
                try{
                    const result=await  this.macman.show_database(`SELECT * FROM ${input};`);
                    await this.trantino.display(input, result);
                    return[code,message];
                }
                catch (error){
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            break;  
            //this is display table coloumn operation 
            case '012':
                try{
                    const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                    result.length>1?message="{\n "+result.map(column =>"["+["Name "+column.name,"Type "+column.type,column.pk==1?"iSPrimary":"NotPrimary"]+"]\n")+"}\nB-go back\n"
                    :console.log("no such table");
                    return[code,message];
                }
                catch (error){
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            //this is search for a certain table row operation
            case '013':
                try{
                    const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                    result.length>1?await this.macman.serch_database(input,result,'SEARCH'):console.log("no such table");
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nB-back\n\n(^o^) enter table name to search\n";
                    return[code,message];
                }
                catch (error){
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            //this is empty table operation
            case '021':
                try{
                    await  this.macman.show_database(`DELETE FROM ${input};`);
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\n\t\t\tTable empty now Happy (T-T)\nB-back\n\ndelete another one (T-T)\n";
                    return[code,message];
                }
                catch (error){
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            //this is delete table row operation
            case '022':
                try{
                    const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                    result.length>1?await this.macman.serch_database(input,result,'DELETE'):console.log("no such table");
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nB-back\n\n(T-T) enter table name to search\n";
                    return[code,message];
                }
                catch (error){
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            //this is drop table operation
            case'023':
                try{
                    const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                    result.length>1?await this.macman.show_database(`DROP TABLE ${input};`):console.log("no such table");
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\n\t\t\t\t(T^T) lost a table happy now\n\nB-back\n\n(T-T) enter table name to Drop\n";
                    return[code,message];
                }
                catch{
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            //this is modify table operation
            case '031':
                const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                if(result.length>1){
                const bismark = await this.trantino.ask('1-modify table name\n2-insert new column\nB-back\n');
                console.clear();
                switch(bismark){
                    //change table name
                    case '1':{
                     const mod =await this.trantino.ask('enter new table name\nenter @b to exit\n');
                    console.clear();
                    if(mod=='@b'){
                        console.clear();
                        return[code,message];
                        
                    }
                    try{
                    await  this.macman.show_database(`ALTER TABLE ${input} RENAME TO ${mod};`);
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nB-back\n\n(^-^) enter table name to modify\n";
                    return[code,message];
                    
                    }
                    catch(error){
                        console.log(error.message);
                        message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                        message=JSON.stringify(message)+"\n\nB-back\n\n(^-^) enter table name to modify\n";
                        return[code,message];
                        
                    }
                    }
                    //insert a new coloumn
                    case '2':{
                        console.clear;
                        var col='';
                        col = await this.macman.add_column(col,input);
                        while(true){
                            const confirm =await this.trantino.ask(`(${col[0]})\n\n`+(col[0].length>0?"y-accept and add new coloumns":"")+"\nd-drop a coloumn\na-add another coloumn\nb-go back\n") ;
                            console.clear();
                            if(confirm.toLowerCase()=='d'){
                                const arr=col.split(',');
                                while(true){
                                    const index = await this.trantino.ask("\n"+arr.map((cols,index) => (index+1)+"-"+cols+"\n")+"enter column index to remove\n");
                                    
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
                                col=arr.join(','); 
                            }
                            else if(confirm.toLowerCase()=='a'){
                                col=await this.macman.add_column(col,input);
                                continue;
                            }
                            else if(confirm.toLowerCase()=='y'){
                                const arr=col[0].split(',');
                                arr.forEach(async (column)=>{
                                    const sql=`ALTER TABLE ${input} ADD COLUMN ${column} ;`;
                                    await this.macman.show_database(sql);
                                });
                                break;
                            }
                            else if(confirm.toLowerCase()=='b'){
                                break;
                            }
                            else{
                               console.log("worng input please enter a valid input char");
                               continue;
                            }
                        }
                        return[code,message];
                        
                    }
                    case 'b':{
                        message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                         message=JSON.stringify(message)+"\n\nB-back\n\n(^-^) enter table name to modify\n";
                         return[code,message];
                        
                    }
                }
            }
            //this is modify a row operation
            case '032':
                try{
                    const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                    result.length>1?await this.macman.serch_database(input,result,'MODIFY'):console.log("no such table");
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nB-back\n\n(^-^) enter table name to search\n";
                    return[code,message];
                }
                catch (error){
                    console.log(error.message+" "+code+"\n");
                    return[code,message];
                }
            //this is create a table operation
            case '033':
                try{
                    await this.macman.create_table(input);
                    return[code,message];
                }
                catch(error){
                    console.log(error);
                    return[code,message];
                }
            //this is insert data operation
            case '034':
                try{
                    const result=await  this.macman.show_database(`PRAGMA table_info(${input});`);
                    if(result.length>1){
                        await this.macman.insert_data(input,result);
                        return[code,message];
                    }
                    else{
                        console.log("no such table");
                        return[code,message];
                    }
                    
                }
                catch(error){
                    console.log(error);
                    return[code,message];
                }
        }
    }
}

module.exports = second_level;