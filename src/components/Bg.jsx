import ParticlesBg from 'particles-bg';
import React from 'react'

const Bg = () => {

    let config= {
        num: [10, 10],
        rps: 0.2,
        radius: [30, 30],
        life: [1, 4],
        v: [2, 3],
        tha: [-50, 40],
        // body: "./img/icon.png", // Whether to render pictures
        //rotate: [0, 20],
        alpha: [0.6, 0],
        scale: [0, 0.1],
        position: "all", // all or center or {x:1,y:1,width:100,height:100}
        color: ["random", "#ff0000"],
        cross: "dead", // cross or bround
        random: 15,  // or null,
        g: 0.6,    // gravity
        //f: [2, -1], // force
        onParticleUpdate: (ctx, particle) => {
            ctx.beginPath();
            ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.closePath();
        }
      };

  return (
    <div className='absolute z-10 top-0 left-0 right-0 w-full h-full  backdrop-brightness-150 !backdrop-blur-3xl'>
      <ParticlesBg type="custom" bg={true} config={config} />
    </div>
  )
}

export default Bg;
