const readline = require('readline');
const second_level = require('./second_level.js');
const Data_Golem = require('./data_functions.js');
const data_director = require('./data_display.js');
const first_level = require('./first_level.js');
const DATA_begin = require('./database_inti.js');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
const Adam=new DATA_begin();
const tarantino= new data_director(rl);
var s='0';
const a ="\n1-create a new database\n2-open a database\n3-delete a database\n4-close\n"
const b= "\nenter new database name or enter @b to go back: "
const c= "\nenter database name or enter  @b to go back: ";
const e=`                   HI there 

1-Display Data
2-Delete Data
3-Modify Data
4-Close`;
const getInput = async  (curr,db) => {
    const macman=new Data_Golem(rl,db,tarantino);
    const SND_LVL=new second_level(rl,macman,tarantino);
    const FST_LVL=new first_level(macman);
    var loop=true;
      while(loop){
        const answer = await tarantino.ask(curr);
        console.clear();
        s=s+String(answer);
        s.substring(3,s.length)==='b'?s=s.slice(0, -2):'';
        if(s.length>3){
            [s,curr]=await SND_LVL.resolve(s.substring(0,3),s.substring(3,s.length),curr);
        }
        else{
            [s,curr]=await FST_LVL.resolve(s,curr);
            if(s=='**'){
                loop=false;
            }
        }
      }
}
async function load() {
    await Adam.start();
}

var exit=true;
async function main(){
    console.clear();
    await load();
    while(exit){
        var data_list=await Adam.read();
        var data_array=data_list.length>0?data_list.split(','):[];
        const file_name_regex=/^[\w,\s-]+\.[A-Za-z]{2,4}$/;
        while(true){
            console.log('\t\t\t\tDatabase list:\n');
            var message="";
            for(var i=0;i<data_array.length;i++){message=message+`\t${i+1}-${data_array[i]}\t`}
            console.log(message);
            const answer = await tarantino.ask(a);
            console.clear();
            if(answer=='1'){
                while(true){
                    const answer = await tarantino.ask("\t\t\t\tCreate Data base\n"+b);
                    console.clear();
                    if(answer=='@b'){break;}
                    if(data_array.includes(answer)){
                        console.log("name already taken chose another one (^-^)");
                        continue;
                    }
                    else if(file_name_regex.test(answer+".db")){
                        data_array.push(answer);
                        await Adam.write(data_array.join(','),answer);
                        break;
                    }
                    else{
                        console.log("invalid database name choose another one (^-^)");
                        continue;
                    }
                }
            }
            else if(answer=='2'){
                while(true){
                    const answer = await tarantino.ask("\t\t\t\tOpen Data base\n"+c);
                    console.clear();
                    if(answer=='@b'){break;}
                    else if(data_array.includes(answer)){
                        const db =await Adam.ini_database(answer);
                        console.clear();
                        await getInput(e+"\n",db);
                    }
                    else{
                        console.log("database file does not exist");
                    }
                }  
            }
            else if(answer=='3'){
                while(true){
                    const answer = await tarantino.ask("\t\t\t\tDelete Data base\n"+c) ;
                    console.clear();
                    if(answer=='@b'){break;}
                    else if(data_array.includes(answer)){
                        data_array=data_array.filter(item => item != answer);
                        await Adam.write(data_array.join(','),answer);
                        await Adam.data_remove(answer);
                        break;
                    }
                   else{
                    console.log("database file does not exist");
                   }
                }
            }
            else if(answer=='4'){
                break;
            }
        }
        
        while(true){
            const enough = await tarantino.ask("are you sure you want to exit (y/n)\n");
            if(String(enough).toLowerCase()=='y'){
                exit=false;
                break;
            }
            else if(String(enough).toLowerCase()=='n'){
                break;
            }
            else{
                continue;
            }
        }
    }
    rl.close();
}

module.exports = main; 