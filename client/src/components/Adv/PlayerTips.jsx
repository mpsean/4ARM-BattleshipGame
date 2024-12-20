import React from 'react';

export const PlayerTips = ({
  gameState,
  hitsbyPlayer,
  hitsByComputer,
  startAgain,
}) => {
  let numberOfHits = hitsbyPlayer.length;
  let numberOfSuccessfulHits = hitsbyPlayer.filter((hit) => hit.type === 'hit').length;
  let accuracyScore = Math.round(100 * (numberOfSuccessfulHits / numberOfHits));
  let succesfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;

  let playPanel = (
    <div className="flex flex-col min-w-56">
      <div className="font-museo text-white text-2xl font-bold">Stats</div>
      <div className="bg-cyan-700 m-3 p-3 rounded-3xl" id="firing-info">
        <ul className="font-museo text-lg text-white px-3 py-4">
          <li>{numberOfSuccessfulHits} successful hits</li>
          <li>{accuracyScore > 0 ? `${accuracyScore}%` : `0%`} accuracy </li>
        </ul>
        <p className="font-museo text-lg text-white px-3 py-4">
          Your score is {numberOfSuccessfulHits}</p>

      </div>
    </div>
  );

  let tipsPanel = (
    <div className="flex flex-col min-w-56">
      <div className="font-museo text-white text-2xl font-bold">Stats</div>
      <div className="bg-cyan-700 m-3 p-3 rounded-3xl" id="firing-info">
        <ul className="font-museo text-lg text-white px-3 py-4">
          <li>{numberOfSuccessfulHits} successful hits</li>
          <li>{accuracyScore > 0 ? `${accuracyScore}%` : `0%`} accuracy </li>
        </ul>
        <p className="font-museo text-lg text-white px-3 py-4">The first to sink all 5 opponent ships wins.</p>
        <p className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 dark:bg-sky-950 hover:bg-green-800" onClick={startAgain}>
          Restart
        </p>
      </div>
    </div>
  );

  return (
    <div id="player-tips">
      {gameState != 'placement'
        ? playPanel
        : tipsPanel}
    </div>
  );
};
