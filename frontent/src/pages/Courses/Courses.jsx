import ScrollReveal from "../../component/ScllorAnimation";
import { useNavigate } from "react-router-dom";

import java from "../../assets/java.png"
import python from "../../assets/python.png"

function Courses(){

    const navigate = useNavigate()

     const courseList = [
      {
        name:"Java Courses",
        link:"/java",
        img:java,
        description:"This a placement oriented courses and help to your placement",
        price:"399",
        buyLink:"/buy/java"
      },
      {
        name:"Python",
        link:"/python",
        img:python,
        description:"This a placement oriented courses and help to your placement",
        price:"299",
        buyLink:"buy.python"
      },
     ]   

    return<>
    
       <div className="text-xl mt-4 md:mt-8  lg:text-3xl  ml-2 md:ml-10 text-center text-slate-100 text-shadow-2xs text-shadow-amber-50 ">
          Courses 
        </div>
        <div className="flex justify-center w-full">
          <hr className="bg-orange-500 ml-2 md:ml-10 h-1 rounded-full w-18 lg:w-25 mt-2 mb-5  border-yellow-500 " />
        </div>
         

        <div className='h-auto  mt-7 mb-4  rounded-2xl p-3  px-4 md:px-8 xl:px-35 grid sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5  '>
        
        {
          courseList.map( (list,index) => 
          <ScrollReveal from="bottom" key={index}>
          <div className='h-auto   place-self-center border-1  border-slate-400 m-1  w-65 rounded-xl shadow-2xl shadow-gray-600 hover:scale-[1.02] transition-all hover:border-2'>
            <img src={list.img} className='h-40 w-80 rounded-t-xl border-1 border-blacks brightness-90'></img>
            <div className='h-auto text-xl pt-3  text-left px-4 rounded-b-xl font-semibold opacity-95'>
                <h1>{list.name}</h1>
                <p className="text-sm my-2 font-normal">{list.description}</p>
                <div className="flex justify-between items-center mb-2">
                <h2 className="my-2">Free</h2>
                <button className="h-8 text-sm  text-gray-900 font-semibold border-1 rounded border-black p-1 m-1 bg-gradient-to-l from-orange-500 to-orange-400 shadow-2xl shadow-white hover:border-yellow-100 active:scale-[0.9]" onClick={()=>navigate(list.buyLink)}>Register now</button>
                </div>
                </div>
          </div>
          </ScrollReveal>)
        }
        </div>
        
    </>
}

export default Courses;