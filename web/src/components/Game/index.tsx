import { useState, useEffect, useRef } from "react";
import Player from "../Player";
import { GameCenter } from "../../components";
import { useGameContext } from "../../context/GameContext";
import { PlayerType } from "../../@types/dixit";

import * as S from "./styles";

const Game = () => {
  const [waiting, setWaiting] = useState(true);
  const { gameData, handleGameSetter } = useGameContext();
  const websocket = useRef<WebSocket | null>(null);
  //const [players, setPlayers] = useState<PlayerType[]>([]);

  useEffect(() => {
    if (gameData) {
      let complete = true;
      gameData.players.forEach((player) => {
        if (player.username === "") {
          complete = false;
        }
      });
      if (complete) {
        
        setWaiting(false);
      }
    }
  }, [gameData]);

  useEffect(() => {
    websocket.current = new WebSocket(`ws://localhost:8081/${gameData?.id}`);
    websocket.current.onopen = () => {
      const dataSocket = {
        action: "enter-room",
        payload: {
          id: gameData?.id,
        },
      };
      console.log("entering game session");
      websocket.current?.send(JSON.stringify(dataSocket));
    };

    websocket.current.onmessage = (event) => {
      const data = event.data;
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.readAsText(data);
        reader.onload = () => {
          const received = JSON.parse(reader.result as string);
          console.log("from websocket ", received);
        };
      } else {
        const ans = JSON.parse(data);
        const players: PlayerType[] = [];
        ans.data.playersString.split(",").forEach((player: string) => {
          if (player !== ":") {
            const p = player.split(":");
            players.push({ username: p[0], email: p[1] });
          } else {
            players.push({ username: "", email: "" });
          }
        });
        console.log("players ", players);
        const dataContext = {
          id: ans.data.id,
          players: players,
          numberOfPlayers: ans.data.numberOfPlayers,
          timePerTurn: ans.data.timePerTurn,
        };
        handleGameSetter(dataContext);

        //console.log("do websoquete ", ans);
      }
    };
    websocket.current.onclose = () => {
      console.log("disconnected");
    };
    return () => {
      websocket.current?.close();
    };
  }, []);

  /* const handlePlayers = (players: PlayerType) => {
    gameData?.players?.push(...players);
    setPlayers(gameData?.players || []);
  }; */
  /* 
  useEffect(() => {

    websocket.current.onmessage = (e) => {
      if(e.data instanceof Blob) {
        const reader = new FileReader();
        reader.readAsText(e.data);
        reader.onload = () => {
          console.log("reader", reader.result);
        }
      }
    };

    handlePlayers(gameData?.players || []);
    if (gameData?.players?.length === gameData?.numberOfPlayers) {
      setWaiting(false);
    }
  }, [gameData?.players]); */

  return (
    <S.Container>
      <S.SideContainer>
        <S.PlayersTitle>Jogadores</S.PlayersTitle>
        {gameData?.players.map((player, index) => (
          <Player key={`${index}-${player}`} data={player} index={index} />
        ))}
      </S.SideContainer>
      <S.CenterContainer>
        <GameCenter waiting={waiting} />
      </S.CenterContainer>
      <S.SideContainer>{`Jogadores: ${gameData?.numberOfPlayers}`}</S.SideContainer>
    </S.Container>
  );
};

export default Game;
