import ScrollReveal from "../../component/ScllorAnimation";
import chatBot from "../../assets/chatBot.png"
import codeAnalyzer from "../../assets/codeAnalyzer.png"
import todo from "../../assets/todo.png"
import chatWithMentor from "../../assets/chatWithTeacher.png"

function EasywayAI(){

     const easywayAIList = [
      {
        name:"Easyway AI chatBot",
        link:"/chatBot",
        img:chatBot
      },
      {
        name:"AI Code Analyzer",
        link:"/code-analyzer",
        img:codeAnalyzer
      },
       {
        name:"Todo List",
        link:"/todo-list",
        img:todo
      },
      {
        name:"Chat with Mentor",
        link:"/chat",
        img:chatWithMentor
      },
       
       
     ]   

    return<>
      {/* Title */}
      <div className="mt-8 md:mt-12 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100">
          Easyway AI
        </h2>
        <div className="flex justify-center mt-2">
          <hr className="bg-orange-500 h-1 rounded-full w-26 md:w-32 lg:w-40 border-0" />
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 mt-8 md:mt-12 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {easywayAIList.map((list, index) => (
            <ScrollReveal from="bottom" key={index}>
              <div
                className="w-full max-w-[170px] sm:max-w-[200px] md:max-w-[220px] 
                           bg-slate-900/70 border border-slate-700 rounded-xl overflow-hidden
                           shadow-[0_0_10px_rgba(255,255,255,0.15)]
                           hover:shadow-[0_0_18px_rgba(255,255,255,0.35)]
                           transition-all duration-300 hover:scale-[1.05] mx-auto"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={list.img}
                    alt={list.name}
                    className="h-28 sm:h-32 md:h-36 lg:h-40 w-full object-cover
                               transform hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <p className="py-2 sm:py-3 text-sm sm:text-base md:text-lg text-center font-medium text-slate-100 bg-slate-950/90">
                  {list.name}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
}

export default EasywayAI;