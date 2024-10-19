//this class is used to display data from tables
class data_director{
    constructor(rl) {
        this.rl = rl;
      }
      //this function displays rows in table 5 rows at a screen 
      //you have the options to move forward , backward , go to the start , exit from table
      async display(table_name,table_data){

        console.log(`                          displaying ${table_name}
                                   ${table_data.length==0?'No Data to display\n':''}`);
        for(var i=1;i<=table_data.length;i++){
           console.log(JSON.stringify(table_data[i-1]));
           if(i==table_data.length){
            const answer = await new Promise(resolve => {
                this.rl.question("\nR-restart from the start\nB-go back a page\nE-exit table\n", (input) => {
                    switch(String(input).toLowerCase()){
                        case 'r':
                            resolve(0);
                            break;
                        case 'b':
                            resolve(Math.max(0,(((Math.ceil(i/5))-2)*5)));
                            break;
                        case 'e':
                            resolve(table_data.length+1);
                            break;
                        default:
                            resolve(i-5);
                            break;
                    }
                });
            });
            console.clear();
            i=answer;
            if (i >= table_data.length) {
                break;
            }
            continue;
            }
            if(i%5==0){
                const answer = await new Promise(resolve => {
                    this.rl.question(i>6?"\nR-restart from the start\nB-go back a bage\nM-show next page\nE-exit":"\nR-restart from the start\nM-show more\nE-exit\n", (input) => {
                        switch(String(input).toLowerCase()){
                            case 'r':
                                resolve(0);
                                break;
                            case 'b':
                                resolve(Math.max(0,i-10));
                                break;
                            case 'm':
                                resolve(i);
                                break;
                            case 'e':
                                resolve(table_data.length+1);
                                break;
                            default:
                                resolve(i-5);
                                break;
                        }
                    })
                });
                if (i > table_data.length) {
                    break;
                }
                console.clear();
                i=answer;
                continue;
            }
        }
        }
        //this is used for reading input from the user
        async  ask(mess){
            const answer =await new Promise(resolve => {
                this.rl.question(mess, (input) => {
                    resolve(input);
                });
            }); 
            return answer;
        }

}

module.exports = data_director;