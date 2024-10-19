import React, { useEffect } from 'react';

const App = () => {

  return (
      <main className="relative bg-front bg-cover h-screen w-screen bg-no-repeat bg-center bg-cover">
          <div className="flex py-16 px-4 mx-auto max-w-screen-xl xl:py-8 lg:px-20 gap-4 items-center flex-col lg:flex-row">
              <div className="max-w-screen-md">
                {/* <h1 class="pt-28 font-montserrat font-black text-8xl text-white drop-shadow-lg">
                  Battleship
                </h1> */}
                <img 
                    src="./assets/images/front-logo.png"
                    alt="Battleship"
                    width={750}
                    className="pt-24"
                />
                <div className="flex gap-10 pt-20">
                  <a href="user/login">
                  <button className="flex justify-center items-center gap-2 px-7 py-4 border-4 font-montserrat font-bold text-xl leading-none bg-coral-red text-white rounded-full bg-sky-700">
                    Simple Mode
                  </button>
                  </a>
                  <a href="user/login">
                  <div>
                  <button className="flex justify-center items-center gap-2 px-7 py-4 border-4 font-montserrat font-bold text-xl leading-none bg-coral-red text-white rounded-full bg-sky-700">
                    Advanced Mode
                  </button>
                  </div>
                  </a>
                </div>
              </div>
          </div>
      </main>
  )
}

export default App