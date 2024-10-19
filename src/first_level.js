/* this is the class for the first level display of the sqllite tool it only handels basic CLI display */
class first_level{
    //macman is a object of database_creation class 
    constructor(macman){
        this.macman=macman
    }
    //it resolves the basic first level(page) of the program
    //working on a switch case system where the letter you enterd (code) is used in navigation 
    //the first level does not provide in functionallity it is pure navigation
    async resolve(code,message){
        code[code.length-1].toLowerCase()==='b'&&code.length>2?code=code.slice(0, -2):'';
            //console.log(code);
            switch(code){
                default:
                    code=code.slice(0, -1)
                    message=message+"\nwrong input please chose a valid option "+code+"\n";
                    return[code,message];
                case '01':
                    message=b+"\n";
                    return[code,message];
                case '02':
                    message=c+"\n";
                    return[code,message];
                case '03':
                    message=d+"\n";
                    return[code,message];
                case '04':
                    message=e+"\n";
                    return[code,message];
                case'011':
                  message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                  message=JSON.stringify(message)+"\n\nb-back\n\n(^o^) enter table name you want to display \n";
                  return[code,message];
                case'012':
                  message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                  message=JSON.stringify(message)+"\n\nb-back\n\n(^o^) enter table name you want to display\n";
                  return[code,message];
                case '013':
                  message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                  message=JSON.stringify(message)+"\n\nb-back\n\n(^o^) enter table name you want to search \n";
                  return[code,message];
                case '021':
                  message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                  message=JSON.stringify(message)+"\n\nb-back\n\n(T-T) enter table name you want to empty \n";
                  return[code,message];
                case '022':
                  message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                  message=JSON.stringify(message)+"\n\nb-back\n\n(T-T) enter table name you want to search \n";
                  return[code,message];
                case '023':
                  message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                  message=JSON.stringify(message)+"\n\nb-back\n\n(T-T) enter table name you want to delete \n";
                  return[code,message];
                case '031':
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nb-back\n\n(^-^) enter table name you want to modify \n";
                    return[code,message];
                case '032':
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nb-back\n\n(^-^) enter table name you want to modify \n";
                    return[code,message];
                case '033':
                    message="\n\nb-back\n\n \\(^o^)/ enter table name \n";
                    return[code,message];
                case '034':
                    message=await this.macman.show_database(`SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';`);
                    message=JSON.stringify(message)+"\n\nb-back\n\n(^-^) enter table name you want to insert data into \n";
                    return[code,message];
                case '0':
                    //console.clear();
                    message=a+"\n";
                    return[code,message];
                case '04y':
                    return['**','**']
                case '04n':
                    code='0';
                    message=a+"\n";
                    return[code,message];
            }
    }
}
//cli message sections//
const a=`                   HI there 

1-Display Data
2-Delete Data
3-Modify Data
4-Close`;
const b=`                   Display DATA

1-Display Tables rows
2-Display Table coloumns
3-Display certian Table row
b-Back`
const c=`                   Delete DATA

1-empty Table
2-Delete Table rows (condtional)
3-Delete Table
b-Back`
const d=`                   Modify Data 

1-Modify Table
2-Modify Table row
3-Create Table
4-insert data
b-Back`
const e=`

            are you sure you want to close(y/n)`
module.exports = first_level;