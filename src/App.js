//import './App.css';
import Phaser from 'phaser'
import { useEffect, useState } from 'react';
import Escena from './components/Escena'


function App() {
  //variable listo para usar en return y que no se repitan los lienzos
  const [listo, setListo] = useState(false);

  //este hook renderiza acciones que react no hace
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene:[Escena]
      // scene: {
      //   preload: preload,
      //   create: create
      // }
    };
    //aquí comienza el juego
    var game = new Phaser.Game(config);

    //Trigger cuando el juego está completamente listo
    game.events.on("LISTO", setListo)

    return () => {
      setListo(false)
      game.destroy(true);
    }

  }, [listo]);

}

export default App;
