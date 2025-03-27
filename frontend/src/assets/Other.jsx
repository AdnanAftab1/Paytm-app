export default function CircleIcon({Char,Color,TextColor}) {
   return (
       <div className={"rounded-[100%] justify-center grid content-center items-center "+Color+" "+TextColor+" h-9 w-9 font-semibold text-2xl"}>{Char}</div>
   )
}



