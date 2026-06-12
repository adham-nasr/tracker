export function getRandomNumber(from:number,to:number){
    const range = to-from+1;
    return Math.floor(Math.random()*range)+from  // 0  - range-1
}